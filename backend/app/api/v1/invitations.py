from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.invitation import InvitationValidation
from app.services.invitation_service import InvitationService

router = APIRouter(prefix="/invitations", tags=["invitations"])


@router.get("/{token}", response_model=InvitationValidation, summary="Validar token de invitación antes del registro")
async def validate_invitation(token: str, db: AsyncSession = Depends(get_db)):
    service = InvitationService(db)
    return await service.validate_token(token)
