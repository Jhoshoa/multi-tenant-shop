import { baseApi } from './baseApi'
import { User } from '../../types/models'

interface RegisterRequest {
  email: string
  password: string
  full_name?: string
  tenant_name?: string
  invitation_token?: string
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

interface SyncRequest {
  full_name?: string
  tenant_name?: string
  invitation_token?: string
}

interface SyncResponse {
  user_id: string
  tenant_id: string
}

export interface InvitationValidation {
  valid: boolean
  email: string
  role: string
  tenant_name: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    sync: builder.mutation<SyncResponse, SyncRequest>({
      query: (body) => ({ url: '/auth/sync', method: 'POST', body }),
    }),

    validateInvitation: builder.query<InvitationValidation, string>({
      query: (token) => `/invitations/${token}`,
    }),
  }),
})

export const {
  useRegisterMutation,
  useGetMeQuery,
  useSyncMutation,
  useValidateInvitationQuery,
} = authApi
