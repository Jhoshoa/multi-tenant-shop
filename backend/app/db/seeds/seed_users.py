import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.tenant import Tenant
from app.infrastructure.supabase import supabase_admin

DEMO_EMAIL = "owner@demo.com"
DEMO_PASSWORD = "demo1234"


async def seed_users(db: AsyncSession, tenant: Tenant) -> None:
    existing = (await db.execute(
        select(User).where(User.email == DEMO_EMAIL)
    )).scalar_one_or_none()

    if existing:
        print(f"  ⚠️  Usuario {DEMO_EMAIL} ya existe, omitiendo.")
        return

    # Crear usuario en Supabase Auth
    try:
        auth_response = supabase_admin.auth.admin.create_user({
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD,
            "email_confirm": True,
        })
        supabase_user_id = uuid.UUID(auth_response.user.id)
        print(f"  ✅ Usuario Supabase Auth creado: {DEMO_EMAIL}")
    except Exception as e:
        # Si el usuario ya existe en Supabase, obtener su ID
        print(f"  ⚠️  Error creando en Supabase Auth: {e}. Generando UUID local.")
        supabase_user_id = uuid.uuid4()

    user = User(
        id=supabase_user_id,
        tenant_id=tenant.id,
        email=DEMO_EMAIL,
        full_name="Demo Owner",
        role="owner",
        is_active=True,
    )
    db.add(user)
    await db.flush()
    print(f"  ✅ Usuario DB creado: {user.email} (role: {user.role})")
