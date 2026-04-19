import jwt as PyJWT
from jwt import PyJWKClient
from app.core.config import settings

_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(
            f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json",
            cache_jwk_set=True,
            lifespan=3600,
        )
    return _jwks_client


def verify_supabase_token(token: str) -> dict:
    """
    Verifica el JWT emitido por Supabase usando JWKS.
    Soporta ES256 (nuevo) y HS256 (legacy).
    """
    try:
        client = _get_jwks_client()
        signing_key = client.get_signing_key_from_jwt(token)
        payload = PyJWT.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            audience="authenticated",
        )
        return payload
    except PyJWT.ExpiredSignatureError:
        raise ValueError("Token expirado")
    except PyJWT.InvalidTokenError as e:
        raise ValueError(f"Token inválido: {e}")
