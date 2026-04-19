import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ListTemplate } from '../../../src/components/templates/ListTemplate'
import { ProductList } from '../../../src/components/organisms/ProductList'
import { useDebounce } from '../../../src/hooks/useDebounce'

export default function ProductsScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  return (
    <ListTemplate
      title="Productos"
      searchValue={search}
      onSearchChange={setSearch}
      onFabPress={() => router.push('/(dashboard)/products/create')}
    >
      <ProductList filters={{ search: debouncedSearch || undefined }} />
    </ListTemplate>
  )
}
