import { baseApi } from './baseApi'
import { InventoryEntry } from '../../types/models'
import { PaginatedResponse } from '../../types/api'

interface AdjustInventoryDto {
  productId: string
  quantity_change: number
  reason: string
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryHistory: builder.query<
      PaginatedResponse<InventoryEntry>,
      { productId: string; page?: number }
    >({
      query: ({ productId, page = 1 }) => ({
        url: `/inventory/${productId}/history`,
        params: { page },
      }),
      providesTags: (_, __, { productId }) => [{ type: 'Inventory', id: productId }],
    }),

    adjustInventory: builder.mutation<InventoryEntry, AdjustInventoryDto>({
      query: ({ productId, ...body }) => ({
        url: `/inventory/${productId}/adjust`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: 'Inventory', id: productId },
        { type: 'Product', id: productId },
      ],
    }),
  }),
})

export const { useGetInventoryHistoryQuery, useAdjustInventoryMutation } = inventoryApi
