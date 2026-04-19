import { baseApi } from './baseApi'

interface InvitationCreate {
  email: string
  role: 'staff' | 'owner'
}

interface InvitationOut {
  id: string
  tenant_id: string
  email: string
  role: string
  expires_at: string
  consumed_at: string | null
  created_at: string
}

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvitation: builder.mutation<InvitationOut, InvitationCreate>({
      query: (body) => ({ url: '/tenants/me/invitations', method: 'POST', body }),
      invalidatesTags: ['Invitation'],
    }),

    listInvitations: builder.query<InvitationOut[], void>({
      query: () => '/tenants/me/invitations',
      providesTags: ['Invitation'],
    }),

    revokeInvitation: builder.mutation<void, string>({
      query: (id) => ({ url: `/tenants/me/invitations/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Invitation'],
    }),
  }),
})

export const {
  useCreateInvitationMutation,
  useListInvitationsQuery,
  useRevokeInvitationMutation,
} = invitationsApi
