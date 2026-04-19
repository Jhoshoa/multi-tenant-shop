import { baseApi } from './baseApi'
import { ProductImage } from '../../types/models'

interface SignImageResponse {
  signature: string
  timestamp: number
  upload_preset: string
  cloud_name: string
}

interface RegisterImageDto {
  productId: string
  cloudinary_id: string
  url: string
}

interface ReorderImagesDto {
  productId: string
  image_ids: string[]
}

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signImage: builder.mutation<SignImageResponse, string>({
      query: (productId) => ({
        url: `/products/${productId}/images/sign`,
        method: 'POST',
      }),
    }),

    registerImage: builder.mutation<ProductImage, RegisterImageDto>({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { productId }) => [{ type: 'Product', id: productId }],
    }),

    deleteImage: builder.mutation<void, { productId: string; imageId: string }>({
      query: ({ productId, imageId }) => ({
        url: `/products/${productId}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { productId }) => [{ type: 'Product', id: productId }],
    }),

    reorderImages: builder.mutation<void, ReorderImagesDto>({
      query: ({ productId, image_ids }) => ({
        url: `/products/${productId}/images/reorder`,
        method: 'PUT',
        body: { image_ids },
      }),
      invalidatesTags: (_, __, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
})

export const {
  useSignImageMutation,
  useRegisterImageMutation,
  useDeleteImageMutation,
  useReorderImagesMutation,
} = imagesApi
