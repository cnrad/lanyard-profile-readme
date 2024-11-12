"use server";
import redis from "@/utils/redis";

export async function getUserCount() {
  let users = await redis.hgetall("users");
  let count = Object.keys(users);

  return count.length;
}
