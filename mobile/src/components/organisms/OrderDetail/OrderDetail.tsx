import React from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '../../../store/api/ordersApi'
import { useGetTenantSettingsQuery } from '../../../store/api/tenantsApi'
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge'
import { AppText } from '../../atoms/Text'
import { Button } from '../../atoms/Button'
import { Divider } from '../../atoms/Divider'
import { Spinner } from '../../atoms/Spinner'
import { ErrorState } from '../../molecules/ErrorState'
import { formatCurrency } from '../../../utils/formatCurrency'
import { openWhatsApp } from '../../../utils/whatsapp'
import { ORDER_STATUSES } from '../../../constants/orderStatuses'
import { OrderStatus } from '../../../types/models'
import { colors } from '../../../constants/theme'

interface OrderDetailProps {
  orderId: string
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId)
  const { data: settings } = useGetTenantSettingsQuery()
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  if (isLoading) return <Spinner fullScreen />
  if (isError || !order) return <ErrorState />

  const handleStatusChange = () => {
    const nextStatuses: Partial<Record<OrderStatus, OrderStatus>> = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    }
    const next = nextStatuses[order.status]
    if (!next) return
    Alert.alert('Cambiar estado', `¿Marcar como "${ORDER_STATUSES[next].label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => updateStatus({ id: orderId, status: next }) },
    ])
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <AppText variant="h2">{order.customer_name}</AppText>
        <OrderStatusBadge status={order.status} />
      </View>

      {order.customer_phone && (
        <AppText variant="muted">{order.customer_phone}</AppText>
      )}

      <Divider />

      {order.items.map((item) => (
        <View key={item.id} style={styles.item}>
          <AppText>{item.product_name} x{item.quantity}</AppText>
          <AppText variant="bold">{formatCurrency(item.total_price)}</AppText>
        </View>
      ))}

      <Divider />

      <View style={styles.row}>
        <AppText variant="bold">Total</AppText>
        <AppText variant="bold">{formatCurrency(order.total)}</AppText>
      </View>

      <View style={styles.actions}>
        {['delivered', 'cancelled'].includes(order.status) ? null : (
          <Button fullWidth loading={isUpdating} onPress={handleStatusChange} style={styles.btn}>
            Avanzar estado
          </Button>
        )}

        {settings?.whatsapp && order.customer_phone && (
          <Button
            fullWidth
            variant="outline"
            onPress={() => openWhatsApp(order, settings.whatsapp!)}
            style={styles.btn}
          >
            Enviar resumen por WhatsApp
          </Button>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  actions: { marginTop: 24, gap: 12 },
  btn: {},
})
