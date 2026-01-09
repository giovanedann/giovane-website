import { NextRequest, NextResponse } from "next/server";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE_NAME } from "@/lib/dynamodb";
import type {
  GameScoreItem,
  LeaderboardResponse,
  LeaderboardEntry,
  SubmitScoreRequest,
  SubmitScoreResponse,
  SkillLevel,
} from "@/types/dynamodb";

const MAX_SCORE = 99999999;
const MAX_REALISTIC_SCORE = 10000000;
const MAX_GAME_DURATION_MS = 3600000;
const MAX_MONSTERS_KILLED = 10000;

function getDiscriminator(fingerprint: string): string {
  return fingerprint.replace("fp_", "").slice(0, 4);
}

function validateScore(input: SubmitScoreRequest): boolean {
  return (
    input.score >= 0 &&
    input.score <= MAX_REALISTIC_SCORE &&
    input.elapsedTimeMs > 0 &&
    input.elapsedTimeMs <= MAX_GAME_DURATION_MS &&
    input.monstersKilled >= 0 &&
    input.monstersKilled <= MAX_MONSTERS_KILLED &&
    input.maxCombo >= 0 &&
    input.maxCombo <= input.monstersKilled + 10 &&
    /^[a-zA-Z0-9 ]{3,20}$/.test(input.playerName) &&
    ["beginner", "intermediate", "expert"].includes(input.skillLevel)
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
): Promise<NextResponse<LeaderboardResponse | { error: string }>> {
  const { gameId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const skillLevel = searchParams.get("skillLevel") as SkillLevel;
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 100);

  if (!skillLevel || !["beginner", "intermediate", "expert"].includes(skillLevel)) {
    return NextResponse.json(
      { error: "Valid skillLevel required (beginner, intermediate, expert)" },
      { status: 400 }
    );
  }

  try {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `LEADERBOARD#${gameId}#${skillLevel}`,
        },
        Limit: limit,
        ScanIndexForward: true,
      })
    );

    const scores: LeaderboardEntry[] = (result.Items || []).map(
      (item, index) => {
        const scoreItem = item as GameScoreItem;
        return {
          rank: index + 1,
          playerName: scoreItem.playerName,
          discriminator: getDiscriminator(scoreItem.userId),
          userId: scoreItem.userId,
          score: scoreItem.score,
          monstersKilled: scoreItem.monstersKilled,
          maxCombo: scoreItem.maxCombo,
          elapsedTimeMs: scoreItem.elapsedTimeMs,
          createdAt: scoreItem.createdAt,
        };
      }
    );

    return NextResponse.json({
      gameId,
      skillLevel,
      scores,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
): Promise<NextResponse<SubmitScoreResponse | { error: string }>> {
  const { gameId } = await params;
  const fingerprint = request.headers.get("x-device-fingerprint");

  if (!fingerprint || !fingerprint.startsWith("fp_")) {
    return NextResponse.json(
      { error: "Device fingerprint required" },
      { status: 401 }
    );
  }

  let body: SubmitScoreRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!validateScore(body)) {
    return NextResponse.json(
      { error: "Invalid score data" },
      { status: 400 }
    );
  }

  const { playerName, score, skillLevel, monstersKilled, maxCombo, elapsedTimeMs } =
    body;
  const timestamp = new Date().toISOString();
  const paddedScore = String(score).padStart(8, "0");
  const invertedScore = String(MAX_SCORE - score).padStart(8, "0");

  const scoreItem: GameScoreItem = {
    PK: `GAME#${gameId}`,
    SK: `SCORE#${paddedScore}#${timestamp}`,
    entityType: "GameScore",
    gameId,
    score,
    playerName,
    skillLevel,
    monstersKilled,
    maxCombo,
    elapsedTimeMs,
    userId: fingerprint,
    userType: "guest",
    createdAt: timestamp,
    GSI1PK: `LEADERBOARD#${gameId}#${skillLevel}`,
    GSI1SK: `SCORE#${invertedScore}`,
    GSI2PK: `USER#GUEST#${fingerprint}`,
    GSI2SK: `GAME#${gameId}#${timestamp}`,
  };

  try {
    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: scoreItem,
      })
    );

    const leaderboard = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `LEADERBOARD#${gameId}#${skillLevel}`,
        },
        Limit: 100,
        ScanIndexForward: true,
      })
    );

    const rank = (leaderboard.Items || []).findIndex(
      (item) => (item as GameScoreItem).SK === scoreItem.SK
    );

    return NextResponse.json({
      success: true,
      rank: rank >= 0 ? rank + 1 : undefined,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Failed to submit score" },
      { status: 500 }
    );
  }
}
