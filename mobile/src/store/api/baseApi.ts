import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { RootState } from '../index'
import { logout, setAccessToken } from '../slices/authSlice'
import { supabase } from '../../lib/supabase'

const fetchQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL + '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const tenantSlug = (getState() as RootState).auth.tenant?.slug
    if (tenantSlug) headers.set('X-Tenant-Slug', tenantSlug)
    return headers
  },
})

const rawBaseQuery: BaseQueryFn = (args, api, extraOptions) => {
  const adjusted = typeof args === 'string'
    ? (args.includes('?') || args.endsWith('/') ? args : `${args}/`)
    : { ...args, url: (args.url?.includes('?') || args.url?.endsWith('/')) ? args.url : `${args.url}/` }
  return fetchQuery(adjusted, api, extraOptions)
}

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if ((result.error as any)?.status === 401) {
    const { data, error } = await supabase.auth.refreshSession()

    if (data.session && !error) {
      api.dispatch(setAccessToken(data.session.access_token))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }
  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Product',
    'Category',
    'Order',
    'Tenant',
    'Inventory',
    'Notification',
    'Invitation',
    'Auth',
  ],
  endpoints: () => ({}),
})
