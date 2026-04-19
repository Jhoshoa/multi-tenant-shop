import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { ScreenTemplate } from '../../src/components/templates/ScreenTemplate'
import { AppText } from '../../src/components/atoms/Text'
import { Button } from '../../src/components/atoms/Button'
import { Icon } from '../../src/components/atoms/Icon'
import { Divider } from '../../src/components/atoms/Divider'
import { TenantForm } from '../../src/components/organisms/TenantForm'
import { useAuth } from '../../src/hooks/useAuth'
import { colors } from '../../src/constants/theme'

export default function PendingScreen() {
  const { tenant, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <ScreenTemplate>
      <View style={styles.statusSection}>
        <Icon name="time-outline" size={48} color={colors.warning} />
        <AppText variant="h2" style={styles.heading}>Tu tienda está en revisión</AppText>
        <AppText variant="muted" style={styles.sub}>
          Revisaremos tu solicitud y te notificaremos cuando esté aprobada. Mientras tanto,
          puedes completar el perfil de tu tienda.
        </AppText>
        {tenant?.status === 'rejected' && (
          <View style={styles.rejectedCard}>
            <AppText style={{ color: colors.error, fontWeight: '600' }}>Solicitud rechazada</AppText>
            {tenant.rejected_reason && (
              <AppText variant="muted">{tenant.rejected_reason}</AppText>
            )}
          </View>
        )}
      </View>

      <Divider />
      <AppText variant="h3" style={styles.sectionTitle}>Perfil de la tienda</AppText>
      <TenantForm />

      <Button variant="ghost" onPress={handleLogout} style={styles.logout}>
        Cerrar sesión
      </Button>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  statusSection: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  heading: { textAlign: 'center' },
  sub: { textAlign: 'center', lineHeight: 22 },
  rejectedCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    gap: 4,
    alignSelf: 'stretch',
  },
  sectionTitle: { marginBottom: 8 },
  logout: { marginTop: 16 },
})
