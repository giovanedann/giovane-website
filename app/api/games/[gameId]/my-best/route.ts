import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE_NAME } from "@/lib/dynamodb";
import type { GameScoreItem, SkillLevel } from "@/types/dynamodb";

interface MyBestResponse {
  bestScore: number | null;
  skillLevel: SkillLevel;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
): Promise<NextResponse<MyBestResponse | { error: string }>> {
  const { gameId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const skillLevel = searchParams.get("skillLevel") as SkillLevel;
  const fingerprint = request.headers.get("x-device-fingerprint");

  if (!fingerprint || !fingerprint.startsWith("fp_")) {
    return NextResponse.json(
      { error: "Device fingerprint required" },
      { status: 401 }
    );
  }

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
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2PK = :pk AND begins_with(GSI2SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#GUEST#${fingerprint}`,
          ":sk": `GAME#${gameId}#`,
        },
      })
    );

    const userScores = (result.Items || []) as GameScoreItem[];
    const scoresForSkillLevel = userScores.filter(
      (item) => item.skillLevel === skillLevel
    );

    const bestScore =
      scoresForSkillLevel.length > 0
        ? Math.max(...scoresForSkillLevel.map((item) => item.score))
        : null;

    return NextResponse.json({
      bestScore,
      skillLevel,
    });
  } catch (error) {
    console.error("Error fetching user best score:", error);
    return NextResponse.json(
      { error: "Failed to fetch best score" },
      { status: 500 }
    );
  }
}
