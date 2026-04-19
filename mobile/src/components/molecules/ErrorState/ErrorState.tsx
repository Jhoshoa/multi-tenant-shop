import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '../../atoms/Text'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Algo salió mal',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Icon name="alert-circle-outline" size={48} color={colors.error} />
      <AppText variant="muted" style={styles.text}>{message}</AppText>
      {onRetry && (
        <Button variant="outline" size="sm" onPress={onRetry} style={styles.button}>
          Reintentar
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  text: { marginTop: 12, textAlign: 'center', marginBottom: 16 },
  button: { marginTop: 8 },
})
