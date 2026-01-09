import { NextRequest, NextResponse } from "next/server";
import {
  GetCommand,
  TransactWriteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE_NAME } from "@/lib/dynamodb";
import type { LikeResponse, PostLikeCountItem, UserLikeItem } from "@/types/dynamodb";

function getUserIdentifier(request: NextRequest): {
  userId: string;
  userType: "guest" | "github";
} | null {
  const fingerprint = request.headers.get("x-device-fingerprint");
  if (fingerprint && fingerprint.startsWith("fp_")) {
    return { userId: fingerprint, userType: "guest" };
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<LikeResponse | { error: string }>> {
  const { slug } = await params;
  const user = getUserIdentifier(request);

  try {
    const likeCountResult = await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `POST#${slug}`,
          SK: "METADATA",
        },
        ProjectionExpression: "likeCount",
      })
    );

    const likeCount =
      (likeCountResult.Item as PostLikeCountItem | undefined)?.likeCount || 0;

    let userLiked = false;
    if (user) {
      const userLikeResult = await dynamodb.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `POST#${slug}`,
            SK: `LIKE#${user.userType.toUpperCase()}#${user.userId}`,
          },
        })
      );
      userLiked = !!userLikeResult.Item;
    }

    return NextResponse.json({ likeCount, userLiked });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<LikeResponse | { error: string }>> {
  const { slug } = await params;
  const user = getUserIdentifier(request);

  if (!user) {
    return NextResponse.json(
      { error: "Device fingerprint required" },
      { status: 401 }
    );
  }

  const likeSK = `LIKE#${user.userType.toUpperCase()}#${user.userId}`;

  try {
    const existingLike = await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `POST#${slug}`,
          SK: likeSK,
        },
      })
    );

    const isLiked = !!existingLike.Item;
    const now = new Date().toISOString();

    if (isLiked) {
      await dynamodb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: TABLE_NAME,
                Key: {
                  PK: `POST#${slug}`,
                  SK: likeSK,
                },
                ConditionExpression: "attribute_exists(PK)",
              },
            },
            {
              Update: {
                TableName: TABLE_NAME,
                Key: {
                  PK: `POST#${slug}`,
                  SK: "METADATA",
                },
                UpdateExpression:
                  "SET likeCount = if_not_exists(likeCount, :one) - :dec, updatedAt = :now",
                ExpressionAttributeValues: {
                  ":dec": 1,
                  ":one": 1,
                  ":now": now,
                },
              },
            },
          ],
        })
      );
    } else {
      const likeItem: UserLikeItem = {
        PK: `POST#${slug}`,
        SK: likeSK,
        entityType: "UserLike",
        userId: user.userId,
        userType: user.userType,
        createdAt: now,
      };

      await dynamodb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: TABLE_NAME,
                Item: likeItem,
                ConditionExpression: "attribute_not_exists(PK)",
              },
            },
            {
              Update: {
                TableName: TABLE_NAME,
                Key: {
                  PK: `POST#${slug}`,
                  SK: "METADATA",
                },
                UpdateExpression:
                  "SET likeCount = if_not_exists(likeCount, :zero) + :inc, updatedAt = :now, entityType = if_not_exists(entityType, :entityType), createdAt = if_not_exists(createdAt, :now)",
                ExpressionAttributeValues: {
                  ":zero": 0,
                  ":inc": 1,
                  ":now": now,
                  ":entityType": "PostLikeCount",
                },
              },
            },
          ],
        })
      );
    }

    const updatedCount = await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `POST#${slug}`,
          SK: "METADATA",
        },
        ProjectionExpression: "likeCount",
      })
    );

    const likeCount =
      (updatedCount.Item as PostLikeCountItem | undefined)?.likeCount || 0;

    return NextResponse.json({ likeCount, userLiked: !isLiked });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
