from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.tenant import Tenant, TenantSettings
from app.models.product import Product
from app.models.order import Order
from app.models.category import Category
from app.schemas.tenant import TenantUpdate, TenantSettingsUpdate, TenantStats
from app.core.exceptions import NotFoundError


class TenantService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_tenant(self, tenant_id) -> Tenant:
        tenant = await self.db.get(Tenant, tenant_id)
        if not tenant:
            raise NotFoundError("Tenant")
        return tenant

    async def update_tenant(self, tenant: Tenant, data: TenantUpdate) -> Tenant:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(tenant, field, value)
        await self.db.flush()
        return tenant

    async def update_settings(self, tenant: Tenant, data: TenantSettingsUpdate) -> TenantSettings:
        settings = tenant.settings
        if not settings:
            settings = TenantSettings(tenant_id=tenant.id)
            self.db.add(settings)

        for field, value in data.model_dump(exclude_none=True).items():
            setattr(settings, field, value)
        await self.db.flush()
        return settings

    async def get_stats(self, tenant_id) -> TenantStats:
        total_products = (await self.db.execute(
            select(func.count()).where(Product.tenant_id == tenant_id)
        )).scalar()

        active_products = (await self.db.execute(
            select(func.count()).where(Product.tenant_id == tenant_id, Product.is_active.is_(True))
        )).scalar()

        total_orders = (await self.db.execute(
            select(func.count()).where(Order.tenant_id == tenant_id)
        )).scalar()

        total_categories = (await self.db.execute(
            select(func.count()).where(Category.tenant_id == tenant_id)
        )).scalar()

        return TenantStats(
            total_products=total_products or 0,
            active_products=active_products or 0,
            total_orders=total_orders or 0,
            total_categories=total_categories or 0,
        )
