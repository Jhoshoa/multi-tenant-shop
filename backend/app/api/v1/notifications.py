import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.schemas.notification import NotificationOut, PushTokenRegister
from app.schemas.common import MessageResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/push-token", response_model=MessageResponse, status_code=201)
async def register_push_token(
    data: PushTokenRegister,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NotificationService(db)
    await service.register_token(current_user.id, data)
    return MessageResponse(detail="Token registrado")


@router.get("/", response_model=list[NotificationOut])
async def list_notifications(
    unread_only: bool = Query(False),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NotificationService(db)
    return await service.get_user_notifications(current_user.id, unread_only)


@router.patch("/{notification_id}/read", response_model=MessageResponse)
async def mark_as_read(
    notification_id: uuid.UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NotificationService(db)
    await service.mark_read(current_user.id, notification_id)
    return MessageResponse(detail="Notificación marcada como leída")
