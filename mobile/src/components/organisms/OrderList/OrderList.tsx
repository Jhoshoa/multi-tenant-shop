import React, { useState } from 'react'
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useGetOrdersQuery } from '../../../store/api/ordersApi'
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge'
import { AppText } from '../../atoms/Text'
import { EmptyState } from '../../molecules/EmptyState'
import { ErrorState } from '../../molecules/ErrorState'
import { Spinner } from '../../atoms/Spinner'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { OrderStatus } from '../../../types/models'
import { colors } from '../../../constants/theme'

interface OrderListProps {
  statusFilter?: OrderStatus
}

export const OrderList: React.FC<OrderListProps> = ({ statusFilter }) => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({
    page,
    status: statusFilter,
  })

  if (isLoading) return <Spinner fullScreen />
  if (isError) return <ErrorState onRetry={refetch} />
  if (!data?.items.length) return <EmptyState message="No hay pedidos" icon="receipt-outline" />

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/(dashboard)/orders/${item.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.row}>
            <AppText variant="bold">{item.customer_name}</AppText>
            <AppText variant="bold">{formatCurrency(item.total)}</AppText>
          </View>
          <View style={styles.row}>
            <OrderStatusBadge status={item.status} />
            <AppText variant="caption">{formatDate(item.created_at)}</AppText>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (data && page < data.pages) setPage((p) => p + 1)
      }}
      onEndReachedThreshold={0.3}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
