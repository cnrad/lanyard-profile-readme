import type { NextApiRequest, NextApiResponse } from "next";
// import redis from "../../src/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // let users = await redis.hgetall("users");
    // let count = Object.keys(users);

    // redis.disconnect();

    // res.status(200).send({ count: count.length });
    res.status(200).send({ count: 971 });
}
