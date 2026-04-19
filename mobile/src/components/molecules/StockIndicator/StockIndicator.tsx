import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '../../atoms/Text'
import { colors } from '../../../constants/theme'

interface StockIndicatorProps {
  stock: number
  threshold: number
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ stock, threshold }) => {
  const isOut = stock === 0
  const isLow = stock > 0 && stock <= threshold
  const color = isOut ? colors.error : isLow ? colors.warning : colors.success
  const label = isOut ? 'Agotado' : isLow ? `Bajo: ${stock}` : `${stock} en stock`

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText style={[styles.text, { color }]}>{label}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '500' },
})
