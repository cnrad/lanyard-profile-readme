"use server";
import redis from "@/utils/redis";

export async function getUserCount() {
  const users = await redis.hgetall("users");
  const count = Object.keys(users);

  return count.length;
}
