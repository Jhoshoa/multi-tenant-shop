import { baseApi } from './baseApi'
import { Product, ProductFilters, CreateProductDto, UpdateProductDto } from '../../types/models'
import { PaginatedResponse } from '../../types/api'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              'Product',
            ]
          : ['Product'],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_, __, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<Product, UpdateProductDto & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Product', id }],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),

    toggleProduct: builder.mutation<Product, string>({
      query: (id) => ({ url: `/products/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductMutation,
} = productsApi
