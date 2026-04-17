import httpx
from app.core.config import settings

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


async def send_push_notification(tokens: list[str], title: str, body: str, data: dict | None = None) -> dict:
    """Envía notificaciones push via Expo Push API."""
    messages = [
        {
            "to": token,
            "title": title,
            "body": body,
            "data": data or {},
            "sound": "default",
        }
        for token in tokens
    ]

    headers = {"Content-Type": "application/json"}
    if settings.EXPO_ACCESS_TOKEN:
        headers["Authorization"] = f"Bearer {settings.EXPO_ACCESS_TOKEN}"

    async with httpx.AsyncClient() as client:
        response = await client.post(EXPO_PUSH_URL, json=messages, headers=headers)
        return response.json()
