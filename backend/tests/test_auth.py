import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_sync_requires_token(client: AsyncClient):
    response = await client.post("/api/v1/auth/sync", json={})
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_me_requires_token(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 403
