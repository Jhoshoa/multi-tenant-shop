import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { AppText } from '../../atoms/Text'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction }) => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <AppText variant="h3" style={styles.title} numberOfLines={1}>{title}</AppText>
      <View style={styles.right}>{rightAction ?? <View style={styles.placeholder} />}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { flex: 1, textAlign: 'center' },
  right: { minWidth: 24, alignItems: 'flex-end' },
  placeholder: { width: 24 },
})
