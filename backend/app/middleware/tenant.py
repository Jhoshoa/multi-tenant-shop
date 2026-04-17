from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.context import set_current_tenant
from app.db.session import AsyncSessionLocal
from sqlalchemy import select


SKIP_PATHS = {"/health", "/docs", "/redoc", "/openapi.json"}


class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in SKIP_PATHS:
            return await call_next(request)

        tenant_slug = request.headers.get("X-Tenant-Slug")
        if tenant_slug:
            from app.models.tenant import Tenant

            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(Tenant).where(
                        Tenant.slug == tenant_slug,
                        Tenant.is_active.is_(True),
                    )
                )
                tenant = result.scalar_one_or_none()
                if tenant:
                    set_current_tenant(tenant)

        return await call_next(request)
