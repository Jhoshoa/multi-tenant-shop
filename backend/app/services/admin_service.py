import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.tenant import Tenant
from app.models.user import User


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_tenants(self, status: str | None, limit: int, offset: int) -> tuple[list[Tenant], int]:
        query = select(Tenant)
        if status:
            query = query.where(Tenant.status == status)
        query = query.order_by(Tenant.created_at.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        tenants = list(result.scalars().all())

        count_query = select(func.count()).select_from(Tenant)
        if status:
            count_query = count_query.where(Tenant.status == status)
        total = (await self.db.execute(count_query)).scalar() or 0

        return tenants, total

    async def get_tenant(self, tenant_id: uuid.UUID) -> Tenant:
        tenant = await self.db.get(Tenant, tenant_id)
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant no encontrado")
        return tenant

    async def approve(self, tenant_id: uuid.UUID) -> Tenant:
        tenant = await self.get_tenant(tenant_id)
        if tenant.status == "active":
            raise HTTPException(status_code=409, detail="El tenant ya está activo")
        tenant.status = "active"
        tenant.is_active = True
        tenant.rejected_reason = None
        await self.db.flush()
        return tenant

    async def reject(self, tenant_id: uuid.UUID, reason: str) -> Tenant:
        tenant = await self.get_tenant(tenant_id)
        if tenant.status == "active":
            raise HTTPException(status_code=409, detail="No se puede rechazar un tenant activo")
        tenant.status = "rejected"
        tenant.is_active = False
        tenant.rejected_reason = reason
        await self.db.flush()
        return tenant

    async def suspend(self, tenant_id: uuid.UUID, reason: str) -> Tenant:
        tenant = await self.get_tenant(tenant_id)
        if tenant.status != "active":
            raise HTTPException(status_code=409, detail="Solo se pueden suspender tenants activos")
        tenant.status = "suspended"
        tenant.is_active = False
        tenant.rejected_reason = reason
        await self.db.flush()
        return tenant

    async def list_users(self, tenant_id: uuid.UUID | None, limit: int, offset: int) -> tuple[list[User], int]:
        query = select(User)
        if tenant_id:
            query = query.where(User.tenant_id == tenant_id)
        query = query.order_by(User.created_at.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        users = list(result.scalars().all())

        count_query = select(func.count()).select_from(User)
        if tenant_id:
            count_query = count_query.where(User.tenant_id == tenant_id)
        total = (await self.db.execute(count_query)).scalar() or 0

        return users, total
