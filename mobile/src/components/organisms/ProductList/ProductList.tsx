import React, { useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useGetProductsQuery } from '../../../store/api/productsApi'
import { ProductCard } from '../../molecules/ProductCard'
import { EmptyState } from '../../molecules/EmptyState'
import { ErrorState } from '../../molecules/ErrorState'
import { Spinner } from '../../atoms/Spinner'
import { ProductFilters } from '../../../types/models'

interface ProductListProps {
  filters?: ProductFilters
}

export const ProductList: React.FC<ProductListProps> = ({ filters = {} }) => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useGetProductsQuery({ ...filters, page })

  if (isLoading) return <Spinner fullScreen />
  if (isError) return <ErrorState onRetry={refetch} />
  if (!data?.items.length) return <EmptyState message="No hay productos todavía" icon="cube-outline" />

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => router.push(`/(dashboard)/products/${item.id}`)}
        />
      )}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (page < data.pages) setPage((p) => p + 1)
      }}
      onEndReachedThreshold={0.3}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16 },
})
