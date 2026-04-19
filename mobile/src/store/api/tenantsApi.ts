import { baseApi } from './baseApi'
import { Tenant, TenantSettings } from '../../types/models'

interface UpdateTenantDto {
  name?: string
  description?: string
  currency?: string
}

interface UpdateTenantSettingsDto {
  whatsapp?: string
  instagram?: string
  address?: string
  logo_url?: string
  business_hours?: Record<string, string>
}

export const tenantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenant: builder.query<Tenant, void>({
      query: () => '/tenants/me',
      providesTags: ['Tenant'],
    }),

    updateTenant: builder.mutation<Tenant, UpdateTenantDto>({
      query: (body) => ({ url: '/tenants/me', method: 'PUT', body }),
      invalidatesTags: ['Tenant'],
    }),

    getTenantSettings: builder.query<TenantSettings, void>({
      query: () => '/tenants/me/settings',
      providesTags: ['Tenant'],
    }),

    updateTenantSettings: builder.mutation<TenantSettings, UpdateTenantSettingsDto>({
      query: (body) => ({ url: '/tenants/me/settings', method: 'PUT', body }),
      invalidatesTags: ['Tenant'],
    }),
  }),
})

export const {
  useGetTenantQuery,
  useUpdateTenantMutation,
  useGetTenantSettingsQuery,
  useUpdateTenantSettingsMutation,
} = tenantsApi
