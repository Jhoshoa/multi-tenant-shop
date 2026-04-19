import React from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { Product } from '../../../types/models'
import { Avatar } from '../../atoms/Avatar'
import { AppText } from '../../atoms/Text'
import { StockIndicator } from '../StockIndicator'
import { PriceDisplay } from '../PriceDisplay'
import { colors } from '../../../constants/theme'

interface ProductCardProps {
  product: Product
  onPress: () => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const firstImage = product.images?.[0]?.url

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={firstImage} name={product.name} size={52} />
      <View style={styles.info}>
        <AppText variant="bold" numberOfLines={1}>{product.name}</AppText>
        <PriceDisplay price={product.price} compareAtPrice={product.compare_at_price} />
        {product.track_inventory && (
          <StockIndicator stock={product.stock} threshold={product.low_stock_threshold} />
        )}
      </View>
      {!product.is_active && (
        <View style={styles.inactiveBadge}>
          <AppText style={styles.inactiveText}>Inactivo</AppText>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  info: { flex: 1, gap: 4 },
  inactiveBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  inactiveText: { fontSize: 11, color: colors.muted },
})
