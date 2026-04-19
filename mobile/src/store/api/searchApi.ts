import { baseApi } from './baseApi'
import { Product } from '../../types/models'
import { PaginatedResponse } from '../../types/api'

interface SearchParams {
  q: string
  page?: number
  category_id?: string
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProducts: builder.query<PaginatedResponse<Product>, SearchParams>({
      query: (params) => ({ url: '/search/products', params }),
    }),
  }),
})

export const { useSearchProductsQuery } = searchApi
