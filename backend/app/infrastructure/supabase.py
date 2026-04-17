from supabase import create_client, Client
from app.core.config import settings

# Cliente con service_role key — operaciones server-side únicamente
# NUNCA exponer esta key al cliente móvil
supabase_admin: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)
