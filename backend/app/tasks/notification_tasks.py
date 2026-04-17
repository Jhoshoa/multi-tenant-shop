import asyncio
from app.tasks.celery_app import celery_app
from app.infrastructure.push import send_push_notification


@celery_app.task(name="notifications.send_push")
def send_push_task(tokens: list[str], title: str, body: str, data: dict | None = None) -> None:
    """Envía push notifications en background."""
    asyncio.run(send_push_notification(tokens, title, body, data))
