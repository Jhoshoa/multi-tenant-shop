import { baseApi } from './baseApi'
import { Notification } from '../../types/models'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    markRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),

    registerPushToken: builder.mutation<void, { token: string }>({
      query: (body) => ({ url: '/notifications/push-token', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useRegisterPushTokenMutation,
} = notificationsApi
