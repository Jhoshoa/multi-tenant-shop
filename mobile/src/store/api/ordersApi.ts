import { baseApi } from './baseApi'
import { Order, OrderStatus } from '../../types/models'
import { PaginatedResponse } from '../../types/api'

interface OrderFilters {
  page?: number
  page_size?: number
  status?: OrderStatus
}

interface UpdateOrderStatusDto {
  id: string
  status: OrderStatus
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, OrderFilters>({
      query: (params) => ({ url: '/orders', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Order' as const, id })),
              'Order',
            ]
          : ['Order'],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Order', id }],
    }),

    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusDto>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Order', id }, 'Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
