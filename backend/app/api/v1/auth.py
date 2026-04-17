from fastapi import APIRouter, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.core.security import verify_supabase_token
from app.schemas.auth import SyncUserRequest, SyncUserResponse, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


@router.post("/sync", response_model=SyncUserResponse, summary="Sincronizar usuario tras registro en Supabase")
async def sync_user(
    data: SyncUserRequest,
    credentials: HTTPAuthorizationCredentials = Security(bearer),
    db: AsyncSession = Depends(get_db),
):
    from fastapi import HTTPException
    try:
        payload = verify_supabase_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    service = AuthService(db)
    user = await service.sync_from_supabase(payload, data.full_name, data.tenant_name)
    return SyncUserResponse(user_id=user.id, tenant_id=user.tenant_id)


@router.get("/me", response_model=UserOut, summary="Perfil del usuario autenticado")
async def get_me(current_user=Depends(get_current_user)):
    return current_user
