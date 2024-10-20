import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 1000,
    lazyConnect: false,
    maxRetriesPerRequest: 1,
});

export default redis;
