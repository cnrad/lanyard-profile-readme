"use server";
import redis from "@/utils/redis";

export async function getUserCount() {
    let users = await redis.hgetall("users");
    let count = Object.keys(users);

    return count.length;
}

export async function isUserMonitored(userId: string) {
    const user = await fetch(
        `https://api.lanyard.rest/v1/users/${userId}`,
    ).then((res) => res.json());

    return user.success === true;
}
