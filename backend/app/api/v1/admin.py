import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_admin
from app.schemas.admin import (
    PaginatedTenants, PaginatedUsers, TenantAdminOut, TenantActionRequest, UserAdminOut
)
from app.schemas.tenant import TenantOut
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/tenants", response_model=PaginatedTenants)
async def list_tenants(
    status: str | None = Query(None, description="Filter by status: pending, active, suspended, rejected"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    items, total = await service.list_tenants(status, limit, offset)
    return PaginatedTenants(items=items, total=total, limit=limit, offset=offset)


@router.get("/tenants/{tenant_id}", response_model=TenantAdminOut)
async def get_tenant(
    tenant_id: uuid.UUID,
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    return await service.get_tenant(tenant_id)


@router.post("/tenants/{tenant_id}/approve", response_model=TenantAdminOut)
async def approve_tenant(
    tenant_id: uuid.UUID,
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    return await service.approve(tenant_id)


@router.post("/tenants/{tenant_id}/reject", response_model=TenantAdminOut)
async def reject_tenant(
    tenant_id: uuid.UUID,
    data: TenantActionRequest,
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    return await service.reject(tenant_id, data.reason)


@router.post("/tenants/{tenant_id}/suspend", response_model=TenantAdminOut)
async def suspend_tenant(
    tenant_id: uuid.UUID,
    data: TenantActionRequest,
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    return await service.suspend(tenant_id, data.reason)


@router.get("/users", response_model=PaginatedUsers)
async def list_users(
    tenant_id: uuid.UUID | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    _=Depends(get_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)
    items, total = await service.list_users(tenant_id, limit, offset)
    return PaginatedUsers(items=items, total=total, limit=limit, offset=offset)
