import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, Tenant } from '../../types/models'

interface AuthState {
  accessToken: string | null
  user: User | null
  tenant: Tenant | null
}

const initialState: AuthState = { accessToken: null, user: null, tenant: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; user: User; tenant: Tenant }>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.tenant = action.payload.tenant
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    updateTenant(state, action: PayloadAction<Tenant>) {
      state.tenant = action.payload
    },
    logout(state) {
      state.accessToken = null
      state.user = null
      state.tenant = null
    },
  },
})

export const { setCredentials, setAccessToken, updateTenant, logout } = authSlice.actions
export default authSlice.reducer
