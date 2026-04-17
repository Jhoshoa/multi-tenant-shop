from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.context import set_current_tenant
from app.db.session import AsyncSessionLocal
from sqlalchemy import select

SKIP_PATHS = {"/health", "/docs", "/redoc", "/openapi.json"}

BUSINESS_PREFIXES = (
    "/api/v1/products",
    "/api/v1/orders",
    "/api/v1/inventory",
    "/api/v1/categories",
    "/api/v1/search",
)


class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in SKIP_PATHS:
            return await call_next(request)

        tenant_slug = request.headers.get("X-Tenant-Slug")
        if tenant_slug:
            from app.models.tenant import Tenant

            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(Tenant).where(Tenant.slug == tenant_slug)
                )
                tenant = result.scalar_one_or_none()

                if tenant:
                    set_current_tenant(tenant)

                    if not tenant.is_active and request.url.path.startswith(BUSINESS_PREFIXES):
                        return JSONResponse(
                            {"detail": f"Tenant '{tenant.slug}' no está activo (estado: {tenant.status})"},
                            status_code=403,
                        )

        return await call_next(request)
