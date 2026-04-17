import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_owner
from app.core.context import get_current_tenant
from app.schemas.tenant import TenantOut, TenantUpdate, TenantSettingsUpdate, TenantStats
from app.schemas.invitation import InvitationCreate, InvitationOut
from app.services.tenant_service import TenantService
from app.services.invitation_service import InvitationService

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/me", response_model=TenantOut)
async def get_my_tenant(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TenantService(db)
    return await service.get_tenant(current_user.tenant_id)


@router.put("/me", response_model=TenantOut)
async def update_my_tenant(
    data: TenantUpdate,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    service = TenantService(db)
    tenant = await service.get_tenant(current_user.tenant_id)
    return await service.update_tenant(tenant, data)


@router.put("/me/settings", response_model=TenantOut)
async def update_settings(
    data: TenantSettingsUpdate,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    service = TenantService(db)
    tenant = await service.get_tenant(current_user.tenant_id)
    await service.update_settings(tenant, data)
    return await service.get_tenant(current_user.tenant_id)


@router.get("/me/stats", response_model=TenantStats)
async def get_stats(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TenantService(db)
    return await service.get_stats(current_user.tenant_id)


@router.post("/me/invitations", response_model=InvitationOut, status_code=201)
async def create_invitation(
    data: InvitationCreate,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    service = InvitationService(db)
    return await service.create(current_user.tenant_id, current_user.id, data)


@router.get("/me/invitations", response_model=list[InvitationOut])
async def list_invitations(current_user=Depends(get_owner), db: AsyncSession = Depends(get_db)):
    service = InvitationService(db)
    return await service.list_pending(current_user.tenant_id)


@router.delete("/me/invitations/{invitation_id}", status_code=204)
async def revoke_invitation(
    invitation_id: uuid.UUID,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    service = InvitationService(db)
    await service.revoke(current_user.tenant_id, invitation_id)
