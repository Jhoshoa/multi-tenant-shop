import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.tenant import Tenant, TenantSettings
from app.models.invitation import Invitation
from app.infrastructure.supabase import supabase_admin
from app.helpers.slugify import unique_slug
from app.core.security import verify_supabase_token


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, email: str, password: str, full_name: str | None, tenant_name: str | None) -> tuple[str, User]:
        try:
            response = supabase_admin.auth.sign_up({"email": email, "password": password})
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        if response.user is None:
            raise HTTPException(status_code=400, detail="No se pudo crear el usuario en Supabase")

        try:
            session_response = supabase_admin.auth.sign_in_with_password({"email": email, "password": password})
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        access_token = session_response.session.access_token
        payload = verify_supabase_token(access_token)
        user = await self.sync_from_supabase(payload, full_name, tenant_name, invitation_token=None)
        return access_token, user

    async def login(self, email: str, password: str) -> tuple[str, User]:
        try:
            response = supabase_admin.auth.sign_in_with_password({"email": email, "password": password})
        except Exception:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        if response.session is None:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        access_token = response.session.access_token
        payload = verify_supabase_token(access_token)
        user_id = uuid.UUID(payload["sub"])

        user = await self.db.get(User, user_id)
        if user is None:
            user = await self.sync_from_supabase(payload, None, None, invitation_token=None)

        if not user.is_active:
            raise HTTPException(status_code=403, detail="Usuario desactivado")

        return access_token, user

    async def sync_from_supabase(
        self,
        payload: dict,
        full_name: str | None,
        tenant_name: str | None,
        invitation_token: str | None,
    ) -> User:
        user_id = uuid.UUID(payload["sub"])
        email = payload.get("email", "")
        meta = payload.get("user_metadata", {})
        resolved_name = full_name or meta.get("full_name") or meta.get("name")
        avatar_url = meta.get("avatar_url") or meta.get("picture")

        existing = await self.db.get(User, user_id)
        if existing:
            return existing

        # Path A: invited staff — join existing tenant, no new tenant created
        if invitation_token:
            invitation = await self._consume_invitation(invitation_token, email)
            user = User(
                id=user_id,
                tenant_id=invitation.tenant_id,
                email=email,
                full_name=resolved_name,
                avatar_url=avatar_url,
                role=invitation.role,
                is_active=True,
            )
            self.db.add(user)
            await self.db.flush()
            return user

        # Path B: new owner — tenant starts as pending, not yet operational
        name = tenant_name or f"Tienda de {resolved_name or email.split('@')[0]}"
        slug = await unique_slug(self.db, Tenant, name)
        tenant = Tenant(
            slug=slug,
            name=name,
            currency="USD",
            plan="free",
            is_active=False,
            status="pending",
        )
        self.db.add(tenant)
        await self.db.flush()

        self.db.add(TenantSettings(tenant_id=tenant.id))

        user = User(
            id=user_id,
            tenant_id=tenant.id,
            email=email,
            full_name=resolved_name,
            avatar_url=avatar_url,
            role="owner",
            is_active=True,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def _consume_invitation(self, token: str, email: str) -> Invitation:
        result = await self.db.execute(
            select(Invitation).where(Invitation.token == token)
        )
        invitation = result.scalar_one_or_none()

        if invitation is None:
            raise HTTPException(status_code=400, detail="Invitación no válida")
        if invitation.consumed_at is not None:
            raise HTTPException(status_code=400, detail="Invitación ya utilizada")
        if invitation.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Invitación expirada")
        if invitation.email.lower() != email.lower():
            raise HTTPException(status_code=400, detail="El email no coincide con la invitación")

        invitation.consumed_at = datetime.now(timezone.utc)
        return invitation
