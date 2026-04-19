import React from 'react'
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { Header } from '../../organisms/Header'
import { SearchBar } from '../../molecules/SearchBar'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface ListTemplateProps {
  title: string
  children: React.ReactNode
  searchValue?: string
  onSearchChange?: (text: string) => void
  onFabPress?: () => void
  headerRight?: React.ReactNode
}

export const ListTemplate: React.FC<ListTemplateProps> = ({
  title,
  children,
  searchValue,
  onSearchChange,
  onFabPress,
  headerRight,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <Header title={title} rightAction={headerRight} />
      {onSearchChange && searchValue !== undefined && (
        <View style={styles.searchWrapper}>
          <SearchBar value={searchValue} onChangeText={onSearchChange} />
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {onFabPress && (
        <TouchableOpacity style={styles.fab} onPress={onFabPress} activeOpacity={0.85}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 10 },
  content: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
})
