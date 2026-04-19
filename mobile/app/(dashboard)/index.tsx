import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenTemplate } from '../../src/components/templates/ScreenTemplate'
import { AppText } from '../../src/components/atoms/Text'
import { Button } from '../../src/components/atoms/Button'
import { Divider } from '../../src/components/atoms/Divider'
import { useAuth } from '../../src/hooks/useAuth'
import { colors } from '../../src/constants/theme'

export default function HomeScreen() {
  const { user, tenant } = useAuth()
  const router = useRouter()

  return (
    <ScreenTemplate>
      <View style={styles.hero}>
        <AppText variant="h1">{tenant?.name}</AppText>
        <AppText variant="muted">Hola, {user?.full_name ?? user?.email}</AppText>
      </View>

      <Divider />

      <View style={styles.grid}>
        <Button
          variant="secondary"
          fullWidth
          onPress={() => router.push('/(dashboard)/products')}
          style={styles.tile}
        >
          Productos
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onPress={() => router.push('/(dashboard)/orders')}
          style={styles.tile}
        >
          Pedidos
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onPress={() => router.push('/(dashboard)/inventory')}
          style={styles.tile}
        >
          Inventario
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onPress={() => router.push('/(dashboard)/settings')}
          style={styles.tile}
        >
          Ajustes
        </Button>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  hero: { paddingVertical: 24, gap: 8 },
  grid: { gap: 12, marginTop: 16 },
  tile: {},
})
