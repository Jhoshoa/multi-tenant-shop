import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_products_requires_auth(client: AsyncClient):
    response = await client.get("/api/v1/products/")
    assert response.status_code == 403  # No bearer token


@pytest.mark.asyncio
async def test_create_product_requires_auth(client: AsyncClient):
    response = await client.post("/api/v1/products/", json={
        "name": "Test Product",
        "price": "10.00",
    })
    assert response.status_code == 403
