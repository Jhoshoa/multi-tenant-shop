import React from 'react'
import { Modal, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useGetCategoriesQuery } from '../../../store/api/categoriesApi'
import { CategoryChip } from '../../molecules/CategoryChip'
import { AppText } from '../../atoms/Text'
import { Button } from '../../atoms/Button'
import { Spinner } from '../../atoms/Spinner'
import { colors } from '../../../constants/theme'

interface CategorySelectorProps {
  visible: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
  onClose: () => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  visible,
  selectedId,
  onSelect,
  onClose,
}) => {
  const { data: categories, isLoading } = useGetCategoriesQuery()

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="h3">Categoría</AppText>
          <Button variant="ghost" size="sm" onPress={onClose}>Cerrar</Button>
        </View>

        {isLoading ? (
          <Spinner fullScreen />
        ) : (
          <FlatList
            data={[{ id: null, name: 'Sin categoría' }, ...(categories ?? [])]}
            keyExtractor={(item) => item.id ?? 'none'}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => { onSelect(item.id); onClose() }}
              >
                <AppText>{item.name}</AppText>
                {selectedId === item.id && (
                  <AppText style={{ color: colors.primary }}>✓</AppText>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
})
