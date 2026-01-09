export type UserType = "github" | "guest";
export type SkillLevel = "beginner" | "intermediate" | "expert";
export type EntityType = "PostLikeCount" | "UserLike" | "GameScore";

export interface DynamoDBItem {
  PK: string;
  SK: string;
  entityType: EntityType;
}

export interface PostLikeCountItem extends DynamoDBItem {
  entityType: "PostLikeCount";
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserLikeItem extends DynamoDBItem {
  entityType: "UserLike";
  userId: string;
  userType: UserType;
  displayName?: string;
  createdAt: string;
}

export interface GameScoreItem extends DynamoDBItem {
  entityType: "GameScore";
  gameId: string;
  score: number;
  playerName: string;
  skillLevel: SkillLevel;
  monstersKilled: number;
  maxCombo: number;
  elapsedTimeMs: number;
  userId: string;
  userType: UserType;
  createdAt: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK?: string;
  GSI2SK?: string;
}

export interface LikeResponse {
  likeCount: number;
  userLiked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  discriminator: string;
  userId: string;
  score: number;
  monstersKilled: number;
  maxCombo: number;
  elapsedTimeMs: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  gameId: string;
  skillLevel: SkillLevel;
  scores: LeaderboardEntry[];
}

export interface SubmitScoreRequest {
  playerName: string;
  score: number;
  skillLevel: SkillLevel;
  monstersKilled: number;
  maxCombo: number;
  elapsedTimeMs: number;
}

export interface SubmitScoreResponse {
  success: boolean;
  rank?: number;
}
