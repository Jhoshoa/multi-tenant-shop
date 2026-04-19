import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useAdjustInventoryMutation } from '../../../store/api/inventoryApi'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { AppText } from '../../atoms/Text'
import { colors } from '../../../constants/theme'

interface InventoryAdjusterProps {
  productId: string
  currentStock: number
}

export const InventoryAdjuster: React.FC<InventoryAdjusterProps> = ({
  productId,
  currentStock,
}) => {
  const [quantityChange, setQuantityChange] = useState('')
  const [reason, setReason] = useState('')
  const [adjust, { isLoading }] = useAdjustInventoryMutation()

  const handleSubmit = async () => {
    const qty = parseInt(quantityChange)
    if (!qty || !reason.trim()) return
    await adjust({ productId, quantity_change: qty, reason })
    setQuantityChange('')
    setReason('')
  }

  return (
    <View style={styles.container}>
      <AppText variant="h3">Ajustar inventario</AppText>
      <AppText variant="muted" style={styles.current}>Stock actual: {currentStock}</AppText>

      <FormField
        label="Cantidad (+/-)"
        value={quantityChange}
        onChangeText={setQuantityChange}
        keyboardType="numbers-and-punctuation"
        placeholder="Ej. +10 o -3"
      />

      <FormField
        label="Motivo"
        value={reason}
        onChangeText={setReason}
        placeholder="Ej. Compra proveedor, ajuste de conteo..."
      />

      <Button fullWidth loading={isLoading} onPress={handleSubmit}>
        Aplicar ajuste
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  current: { marginBottom: 16 },
})
