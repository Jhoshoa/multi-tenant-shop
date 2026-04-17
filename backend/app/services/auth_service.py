import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.tenant import Tenant, TenantSettings
from app.infrastructure.supabase import supabase_admin
from app.helpers.slugify import unique_slug


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def sync_from_supabase(self, payload: dict, full_name: str | None, tenant_name: str | None) -> User:
        """
        Crea el usuario en public.users y le asigna un tenant.
        Llamado una sola vez tras el registro en Supabase Auth.
        """
        user_id = uuid.UUID(payload["sub"])
        email = payload.get("email", "")

        # Si ya existe, devolver sin duplicar
        existing = await self.db.get(User, user_id)
        if existing:
            return existing

        # Crear tenant
        name = tenant_name or f"Tienda de {full_name or email.split('@')[0]}"
        slug = await unique_slug(self.db, Tenant, name)
        tenant = Tenant(slug=slug, name=name, currency="USD", plan="free", is_active=True)
        self.db.add(tenant)
        await self.db.flush()

        tenant_settings = TenantSettings(tenant_id=tenant.id)
        self.db.add(tenant_settings)

        # Crear usuario con el mismo UUID de Supabase
        user = User(
            id=user_id,
            tenant_id=tenant.id,
            email=email,
            full_name=full_name,
            role="owner",
            is_active=True,
        )
        self.db.add(user)
        await self.db.flush()
        return user
