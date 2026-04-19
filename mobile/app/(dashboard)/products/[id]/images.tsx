import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { FormTemplate } from '../../../../src/components/templates/FormTemplate'
import { ImageUploader } from '../../../../src/components/organisms/ImageUploader'
import { Spinner } from '../../../../src/components/atoms/Spinner'
import { ErrorState } from '../../../../src/components/molecules/ErrorState'
import { useGetProductQuery } from '../../../../src/store/api/productsApi'

export default function ProductImagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: product, isLoading, isError } = useGetProductQuery(id!)

  if (isLoading) return <Spinner fullScreen />
  if (isError || !product) return <ErrorState />

  return (
    <FormTemplate title="Fotos del producto">
      <ImageUploader productId={id!} images={product.images} />
    </FormTemplate>
  )
}
