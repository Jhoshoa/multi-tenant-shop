import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout, setCredentials } from '../store/slices/authSlice'
import { baseApi } from '../store/api/baseApi'
import { useRegisterMutation } from '../store/api/authApi'
import { supabase } from '../lib/supabase'
import { Tenant, User } from '../types/models'

const API = process.env.EXPO_PUBLIC_API_URL + '/api/v1'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const [registerMutation] = useRegisterMutation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
    dispatch(baseApi.util.resetApiState())
  }

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const token = data.session.access_token
    const headers = { Authorization: `Bearer ${token}` }

    const [userRes, tenantRes] = await Promise.all([
      fetch(`${API}/auth/me`, { headers }),
      fetch(`${API}/tenants/me`, { headers }),
    ])

    if (!userRes.ok || !tenantRes.ok) throw new Error('Error cargando perfil')

    const user: User = await userRes.json()
    const tenant: Tenant = await tenantRes.json()

    dispatch(setCredentials({ accessToken: token, user, tenant }))
    return { user, tenant }
  }

  const handleRegister = async (params: {
    email: string
    password: string
    full_name?: string
    tenant_name?: string
    invitation_token?: string
  }) => {
    const result = await registerMutation(params).unwrap()

    const tenantRes = await fetch(`${API}/tenants/me`, {
      headers: { Authorization: `Bearer ${result.access_token}` },
    })
    const tenant: Tenant = await tenantRes.json()

    dispatch(
      setCredentials({
        accessToken: result.access_token,
        user: result.user,
        tenant,
      })
    )
    return { user: result.user, tenant }
  }

  const handleOAuthSync = async (
    accessToken: string,
    params: { full_name?: string; invitation_token?: string }
  ) => {
    const headers = { Authorization: `Bearer ${accessToken}` }

    await fetch(`${API}/auth/sync`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    const [userRes, tenantRes] = await Promise.all([
      fetch(`${API}/auth/me`, { headers }),
      fetch(`${API}/tenants/me`, { headers }),
    ])

    const user: User = await userRes.json()
    const tenant: Tenant = await tenantRes.json()

    dispatch(setCredentials({ accessToken, user, tenant }))
    return { user, tenant }
  }

  return {
    user: auth.user,
    tenant: auth.tenant,
    accessToken: auth.accessToken,
    isAuthenticated: !!auth.accessToken,
    tenantStatus: auth.tenant?.status ?? null,
    login: handleLogin,
    register: handleRegister,
    syncOAuth: handleOAuthSync,
    logout: handleLogout,
  }
}
