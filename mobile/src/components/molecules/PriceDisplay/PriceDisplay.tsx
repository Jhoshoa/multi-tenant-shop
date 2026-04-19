import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '../../atoms/Text'
import { formatCurrency } from '../../../utils/formatCurrency'
import { colors } from '../../../constants/theme'

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number | null
  currency?: string
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  currency = 'USD',
}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.price}>{formatCurrency(price, currency)}</AppText>
      {compareAtPrice && compareAtPrice > price && (
        <AppText style={styles.compareAt}>{formatCurrency(compareAtPrice, currency)}</AppText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 14, fontWeight: '700', color: colors.text.primary },
  compareAt: {
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
})
