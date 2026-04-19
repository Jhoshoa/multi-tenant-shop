import React from 'react'
import { Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FormTemplate } from '../../../../src/components/templates/FormTemplate'
import { ProductForm } from '../../../../src/components/organisms/ProductForm'
import { Spinner } from '../../../../src/components/atoms/Spinner'
import { ErrorState } from '../../../../src/components/molecules/ErrorState'
import { useGetProductQuery, useUpdateProductMutation } from '../../../../src/store/api/productsApi'
import { CreateProductDto } from '../../../../src/types/models'

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: product, isLoading, isError } = useGetProductQuery(id!)
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()

  if (isLoading) return <Spinner fullScreen />
  if (isError || !product) return <ErrorState />

  const handleSubmit = async (data: CreateProductDto) => {
    try {
      await updateProduct({ id: id!, ...data }).unwrap()
      router.back()
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el producto')
    }
  }

  return (
    <FormTemplate title={product.name}>
      <ProductForm
        defaultValues={product}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </FormTemplate>
  )
}
