import React, { useState } from 'react'
import { FlatList, View, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { ListTemplate } from '../../src/components/templates/ListTemplate'
import { InventoryAdjuster } from '../../src/components/organisms/InventoryAdjuster'
import { AppText } from '../../src/components/atoms/Text'
import { StockIndicator } from '../../src/components/molecules/StockIndicator'
import { Spinner } from '../../src/components/atoms/Spinner'
import { ErrorState } from '../../src/components/molecules/ErrorState'
import { useGetProductsQuery } from '../../src/store/api/productsApi'
import { Product } from '../../src/types/models'
import { colors } from '../../src/constants/theme'

export default function InventoryScreen() {
  const { data, isLoading, isError, refetch } = useGetProductsQuery({ track_inventory: true })
  const [selected, setSelected] = useState<Product | null>(null)

  if (isLoading) return <Spinner fullScreen />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <>
      <ListTemplate title="Inventario">
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.8}>
              <AppText variant="bold" numberOfLines={1}>{item.name}</AppText>
              <StockIndicator stock={item.stock} threshold={item.low_stock_threshold} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      </ListTemplate>

      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <InventoryAdjuster
            productId={selected.id}
            currentStock={selected.stock}
          />
        )}
      </Modal>
    </>
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
    gap: 6,
  },
})
