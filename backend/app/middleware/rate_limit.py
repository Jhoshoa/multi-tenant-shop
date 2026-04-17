from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import redis.asyncio as aioredis

from app.core.config import settings

_redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

LIMIT = 200   # requests por ventana
WINDOW = 60   # segundos


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        tenant_slug = request.headers.get("X-Tenant-Slug", "anonymous")
        key = f"rate_limit:{tenant_slug}"

        try:
            count = await _redis.incr(key)
            if count == 1:
                await _redis.expire(key, WINDOW)

            if count > LIMIT:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Try again later."},
                )
        except Exception:
            # Si Redis no está disponible, no bloquear el tráfico
            pass

        return await call_next(request)
