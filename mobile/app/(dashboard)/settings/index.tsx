import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenTemplate } from '../../../src/components/templates/ScreenTemplate'
import { Header } from '../../../src/components/organisms/Header'
import { AppText } from '../../../src/components/atoms/Text'
import { Button } from '../../../src/components/atoms/Button'
import { Avatar } from '../../../src/components/atoms/Avatar'
import { Divider } from '../../../src/components/atoms/Divider'
import { useAuth } from '../../../src/hooks/useAuth'

export default function SettingsScreen() {
  const { user, tenant, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <ScreenTemplate>
      <Header title="Ajustes" />
      <View style={styles.profile}>
        <Avatar name={user?.full_name ?? user?.email} size={64} />
        <View>
          <AppText variant="bold">{user?.full_name ?? 'Sin nombre'}</AppText>
          <AppText variant="muted">{user?.email}</AppText>
          <AppText variant="caption">Rol: {user?.role}</AppText>
        </View>
      </View>

      <Divider />

      <Button
        variant="outline"
        fullWidth
        onPress={() => router.push('/(dashboard)/settings/store')}
        style={styles.btn}
      >
        Configuración de la tienda
      </Button>

      <Button variant="danger" fullWidth onPress={handleLogout} style={styles.btn}>
        Cerrar sesión
      </Button>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  btn: { marginTop: 12 },
})
