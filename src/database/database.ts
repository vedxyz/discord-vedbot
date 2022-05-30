import { Pool } from "pg";
import { Snowflake } from "discord.js";
import logger from "../utils/logger";

const pgpool = new Pool();

pgpool.on("error", (err) => {
  logger.error("Database error:\n", err);
});

interface RuleRow {
  index: number;
  content: string;
}

const ruleExists = async (serverId: Snowflake, ruleIndex: number): Promise<boolean> => {
  const result = await pgpool.query(
    "SELECT EXISTS(SELECT 1 FROM rules WHERE server_id = $1 AND rule_index = $2) AS exists",
    [serverId, ruleIndex]
  );
  return result.rows[0].exists;
};

const getRules = async (serverId: Snowflake): Promise<RuleRow[]> => {
  const result = await pgpool.query(
    "SELECT rule_index, rule_content FROM rules WHERE server_id = $1 ORDER BY rule_index",
    [serverId]
  );
  return result.rows.map((row) => ({ index: row.rule_index, content: row.rule_content }));
};

const getRule = async (serverId: Snowflake, ruleIndex: number): Promise<RuleRow> => {
  const result = await pgpool.query(
    "SELECT rule_index, rule_content FROM rules WHERE server_id = $1 AND rule_index = $2",
    [serverId, ruleIndex]
  );
  return { index: result.rows[0].rule_index, content: result.rows[0].rule_content };
};

const setRule = async (serverId: Snowflake, rule: RuleRow): Promise<void> => {
  const existing = await pgpool.query("SELECT rule_id FROM rules WHERE server_id = $1 AND rule_index = $2)", [
    serverId,
    rule.index,
  ]);

  if (existing.rowCount) {
    await pgpool.query("UPDATE rules SET rule_content = $1 WHERE rule_id = $2", [
      rule.content,
      existing.rows[0].rule_id,
    ]);
  } else {
    await pgpool.query("INSERT INTO rules(server_id, rule_index, rule_content) VALUES($1, $2, $3)", [
      serverId,
      rule.index,
      rule.content,
    ]);
  }
};

export const rules = {
  exists: ruleExists,
  getAll: getRules,
  get: getRule,
  set: setRule,
};

interface ServerRow {
  id: Snowflake;
  nickname: string;
}

const getServerId = async (nickname: string): Promise<Snowflake> => {
  const result = await pgpool.query("SELECT server_id FROM servers WHERE server_nickname = $1", [nickname]);
  return result.rows[0].server_id;
};

const getAllServerIds = async (): Promise<Snowflake[]> => {
  const result = await pgpool.query("SELECT server_id FROM servers");
  return result.rows.map((row) => row.server_id);
};

const getAllServers = async (): Promise<ServerRow[]> => {
  const result = await pgpool.query("SELECT * FROM servers");
  return result.rows.map((row) => ({ id: row.server_id, nickname: row.server_nickname }));
};

const getChannelId = async (serverId: Snowflake, channelType: string): Promise<Snowflake> => {
  const result = await pgpool.query("SELECT channel_id FROM channels WHERE server_id = $1 AND channel_type = $2", [
    serverId,
    channelType,
  ]);
  return result.rows[0].channel_id;
};

const getRoleId = async (serverId: Snowflake, roleType: string): Promise<Snowflake> => {
  const result = await pgpool.query("SELECT role_id FROM roles WHERE server_id = $1 AND role_type = $2", [
    serverId,
    roleType,
  ]);
  return result.rows[0].role_id;
};

const getAllRoleIdsOfType = async (roleType: string): Promise<Snowflake[]> => {
  const result = await pgpool.query("SELECT role_id FROM roles WHERE role_type = $1", [roleType]);
  return result.rows.map((row) => row.role_id);
};

export const ids = {
  getServerId,
  getAllServerIds,
  getAllServers,
  getChannelId,
  getRoleId,
  getAllRoleIdsOfType,
};

const hasMentionImageUrl = async (serverId: Snowflake, userId: Snowflake): Promise<boolean> => {
  const result = await pgpool.query(
    "SELECT EXISTS(SELECT 1 FROM mention_images WHERE server_id = $1 AND user_id = $2) AS exists",
    [serverId, userId]
  );
  return result.rows[0].exists;
};

const getMentionImageUrl = async (serverId: Snowflake, userId: Snowflake): Promise<string> => {
  const result = await pgpool.query("SELECT image_url FROM mention_images WHERE server_id = $1 AND user_id = $2", [
    serverId,
    userId,
  ]);
  return result.rows[0].image_url;
};

const setMentionImageUrl = async (serverId: Snowflake, userId: Snowflake, imageUrl: string): Promise<void> => {
  const existing = await pgpool.query("SELECT image_id FROM mention_images WHERE server_id = $1 AND user_id = $2)", [
    serverId,
    userId,
  ]);

  if (existing.rowCount) {
    await pgpool.query("UPDATE mention_images SET image_url = $1 WHERE image_id = $2", [
      imageUrl,
      existing.rows[0].image_id,
    ]);
  } else {
    await pgpool.query("INSERT INTO mention_images(user_id, server_id, image_url) VALUES($1, $2, $3)", [
      userId,
      serverId,
      imageUrl,
    ]);
  }
};

const deleteMentionImageUrl = async (serverId: Snowflake, userId: Snowflake): Promise<void> => {
  await pgpool.query("DELETE FROM mention_images WHERE server_id = $1 AND user_id = $2", [serverId, userId]);
};

export const mentionImages = {
  has: hasMentionImageUrl,
  get: getMentionImageUrl,
  set: setMentionImageUrl,
  delete: deleteMentionImageUrl,
};

export enum MealSubscriptionType {
  Lunch,
  Dinner,
  Both,
}

interface MealSubscription {
  userId: Snowflake;
  type: MealSubscriptionType;
  weekend: boolean;
}

const hasMealSubscription = async (userId: Snowflake, subscriptionType: MealSubscriptionType): Promise<boolean> => {
  const result = await pgpool.query(
    "SELECT EXISTS(SELECT 1 FROM meal_subscriptions WHERE user_id = $1 AND subscription_type = $2) AS exists",
    [userId, subscriptionType]
  );
  return result.rows[0].exists;
};

const setMealSubscription = async (
  userId: Snowflake,
  subscriptionType: MealSubscriptionType,
  hour: number,
  weekend: boolean
): Promise<void> => {
  const existing = await pgpool.query(
    "SELECT subscription_id FROM meal_subscriptions WHERE user_id = $1 AND subscription_type = $2",
    [userId, subscriptionType]
  );

  if (existing.rowCount) {
    await pgpool.query("UPDATE meal_subscriptions SET hour = $1, weekend = $2 WHERE subscription_id = $3", [
      hour,
      weekend,
      existing.rows[0].subscription_id,
    ]);
  } else {
    await pgpool.query(
      "INSERT INTO meal_subscriptions(user_id, subscription_type, hour, weekend) VALUES($1, $2, $3, $4)",
      [userId, subscriptionType, hour, weekend]
    );
  }
};

const deleteMealSubscription = async (userId: Snowflake, subscriptionType: MealSubscriptionType): Promise<void> => {
  await pgpool.query("DELETE FROM meal_subscriptions WHERE user_id = $1 AND subscription_type = $2", [
    userId,
    subscriptionType,
  ]);
};

const getMealSubscriptionsForHour = async (hour: number): Promise<MealSubscription[]> => {
  const result = await pgpool.query(
    "SELECT user_id, subscription_type, weekend FROM meal_subscriptions WHERE hour = $1",
    [hour]
  );
  return result.rows.map((row) => ({ userId: row.user_id, type: row.subscription_type, weekend: row.weekend }));
};

export const mealSubscriptions = {
  has: hasMealSubscription,
  set: setMealSubscription,
  delete: deleteMealSubscription,
  getForHour: getMealSubscriptionsForHour,
};

export const endDatabaseConnection = async (): Promise<void> => {
  await pgpool.end();
};
