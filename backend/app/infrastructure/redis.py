import redis.asyncio as aioredis
from app.core.config import settings

redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)


async def set_cache(key: str, value: str, ttl: int = 300) -> None:
    await redis_client.set(key, value, ex=ttl)


async def get_cache(key: str) -> str | None:
    return await redis_client.get(key)


async def delete_cache(key: str) -> None:
    await redis_client.delete(key)


async def invalidate_pattern(pattern: str) -> None:
    keys = await redis_client.keys(pattern)
    if keys:
        await redis_client.delete(*keys)
