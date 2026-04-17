import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.notification import Notification, PushToken
from app.schemas.notification import PushTokenRegister
from app.infrastructure.push import send_push_notification


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_token(self, user_id: uuid.UUID, data: PushTokenRegister) -> PushToken:
        existing = (await self.db.execute(
            select(PushToken).where(PushToken.token == data.token)
        )).scalar_one_or_none()

        if existing:
            existing.user_id = user_id
            existing.platform = data.platform
            await self.db.flush()
            return existing

        token = PushToken(user_id=user_id, token=data.token, platform=data.platform)
        self.db.add(token)
        await self.db.flush()
        return token

    async def get_user_notifications(self, user_id: uuid.UUID, unread_only: bool = False) -> list[Notification]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            query = query.where(Notification.read_at.is_(None))
        query = query.order_by(Notification.created_at.desc()).limit(50)
        return (await self.db.execute(query)).scalars().all()

    async def mark_read(self, user_id: uuid.UUID, notification_id: uuid.UUID) -> None:
        from datetime import datetime, timezone
        await self.db.execute(
            update(Notification)
            .where(Notification.id == notification_id, Notification.user_id == user_id)
            .values(read_at=datetime.now(timezone.utc))
        )
        await self.db.flush()

    async def send_to_user(self, user_id: uuid.UUID, tenant_id: uuid.UUID,
                           type: str, title: str, body: str, data: dict | None = None) -> None:
        notification = Notification(
            tenant_id=tenant_id, user_id=user_id,
            type=type, title=title, body=body, data=data,
        )
        self.db.add(notification)

        tokens = (await self.db.execute(
            select(PushToken.token).where(PushToken.user_id == user_id)
        )).scalars().all()

        if tokens:
            await send_push_notification(list(tokens), title, body, data)

        await self.db.flush()
