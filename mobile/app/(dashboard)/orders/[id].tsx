import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { FormTemplate } from '../../../src/components/templates/FormTemplate'
import { OrderDetail } from '../../../src/components/organisms/OrderDetail'

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <FormTemplate title="Detalle del pedido">
      <OrderDetail orderId={id!} />
    </FormTemplate>
  )
}
