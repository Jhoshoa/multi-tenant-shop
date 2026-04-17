import uuid
from datetime import datetime
from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: uuid.UUID
    type: str
    title: str
    body: str
    data: dict | None
    read_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class PushTokenRegister(BaseModel):
    token: str
    platform: str   # ios | android
