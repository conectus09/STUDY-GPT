import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var chinwagRedis: Redis | undefined;
}

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!global.chinwagRedis) {
    global.chinwagRedis = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }

  return global.chinwagRedis;
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}