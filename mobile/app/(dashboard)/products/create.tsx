import React from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { FormTemplate } from '../../../src/components/templates/FormTemplate'
import { ProductForm } from '../../../src/components/organisms/ProductForm'
import { useCreateProductMutation } from '../../../src/store/api/productsApi'
import { CreateProductDto } from '../../../src/types/models'

export default function CreateProductScreen() {
  const router = useRouter()
  const [createProduct, { isLoading }] = useCreateProductMutation()

  const handleSubmit = async (data: CreateProductDto) => {
    try {
      await createProduct(data).unwrap()
      router.back()
    } catch {
      Alert.alert('Error', 'No se pudo crear el producto')
    }
  }

  return (
    <FormTemplate title="Nuevo producto">
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </FormTemplate>
  )
}
