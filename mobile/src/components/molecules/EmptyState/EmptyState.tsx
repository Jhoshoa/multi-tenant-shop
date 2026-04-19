import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '../../atoms/Text'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface EmptyStateProps {
  message?: string
  icon?: React.ComponentProps<typeof Icon>['name']
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No hay datos todavía',
  icon = 'file-tray-outline',
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={48} color={colors.border} />
      <AppText variant="muted" style={styles.text}>{message}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  text: { marginTop: 12, textAlign: 'center' },
})
