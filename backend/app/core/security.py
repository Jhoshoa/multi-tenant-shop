import jwt as PyJWT
from app.core.config import settings


def verify_supabase_token(token: str) -> dict:
    """
    Verifica el JWT emitido por Supabase usando el JWT secret del proyecto.
    Verificación local — sin llamadas a red.
    """
    try:
        payload = PyJWT.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except PyJWT.ExpiredSignatureError:
        raise ValueError("Token expirado")
    except PyJWT.InvalidTokenError as e:
        raise ValueError(f"Token inválido: {e}")
