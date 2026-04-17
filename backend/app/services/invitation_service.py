import secrets
import uuid
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.invitation import Invitation
from app.models.tenant import Tenant
from app.schemas.invitation import InvitationCreate, InvitationValidation

INVITATION_TTL_DAYS = 7


class InvitationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, tenant_id: uuid.UUID, created_by: uuid.UUID, data: InvitationCreate) -> Invitation:
        # Prevent duplicate pending invitations for the same email + tenant
        existing = await self.db.execute(
            select(Invitation).where(
                Invitation.tenant_id == tenant_id,
                Invitation.email == data.email.lower(),
                Invitation.consumed_at.is_(None),
                Invitation.expires_at > datetime.now(timezone.utc),
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Ya existe una invitación pendiente para ese email")

        invitation = Invitation(
            tenant_id=tenant_id,
            created_by=created_by,
            email=data.email.lower(),
            role=data.role,
            token=secrets.token_urlsafe(32),
            expires_at=datetime.now(timezone.utc) + timedelta(days=INVITATION_TTL_DAYS),
        )
        self.db.add(invitation)
        await self.db.flush()
        return invitation

    async def list_pending(self, tenant_id: uuid.UUID) -> list[Invitation]:
        result = await self.db.execute(
            select(Invitation).where(
                Invitation.tenant_id == tenant_id,
                Invitation.consumed_at.is_(None),
                Invitation.expires_at > datetime.now(timezone.utc),
            ).order_by(Invitation.created_at.desc())
        )
        return list(result.scalars().all())

    async def revoke(self, tenant_id: uuid.UUID, invitation_id: uuid.UUID) -> None:
        invitation = await self.db.get(Invitation, invitation_id)
        if not invitation or invitation.tenant_id != tenant_id:
            raise HTTPException(status_code=404, detail="Invitación no encontrada")
        if invitation.consumed_at is not None:
            raise HTTPException(status_code=409, detail="La invitación ya fue utilizada")
        # Expire it immediately
        invitation.expires_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def validate_token(self, token: str) -> InvitationValidation:
        result = await self.db.execute(
            select(Invitation).where(Invitation.token == token)
        )
        invitation = result.scalar_one_or_none()

        if (
            invitation is None
            or invitation.consumed_at is not None
            or invitation.expires_at < datetime.now(timezone.utc)
        ):
            return InvitationValidation(valid=False, email="", role="", tenant_name="")

        tenant = await self.db.get(Tenant, invitation.tenant_id)
        return InvitationValidation(
            valid=True,
            email=invitation.email,
            role=invitation.role,
            tenant_name=tenant.name if tenant else "",
        )
