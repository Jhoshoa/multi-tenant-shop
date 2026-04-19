import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { AuthTemplate } from '../../src/components/templates/AuthTemplate'
import { FormField } from '../../src/components/molecules/FormField'
import { Button } from '../../src/components/atoms/Button'
import { AppText } from '../../src/components/atoms/Text'
import { Spinner } from '../../src/components/atoms/Spinner'
import { ErrorState } from '../../src/components/molecules/ErrorState'
import { useValidateInvitationQuery } from '../../src/store/api/authApi'
import { useAuth } from '../../src/hooks/useAuth'

export default function JoinScreen() {
  const { token } = useLocalSearchParams<{ token: string }>()
  const { data: invitation, isLoading, isError } = useValidateInvitationQuery(token ?? '')
  const { register } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) return <ErrorState message="Token de invitación no encontrado" />
  if (isLoading) return <Spinner fullScreen />
  if (isError || !invitation?.valid) return <ErrorState message="Invitación inválida o expirada" />

  const handleJoin = async () => {
    if (!password) return
    setLoading(true)
    try {
      await register({
        email: invitation.email,
        password,
        invitation_token: token,
      })
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo completar el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate>
      <AppText variant="h2" style={styles.title}>Únete al equipo</AppText>
      <AppText variant="muted" style={styles.sub}>
        Te invitaron a{' '}
        <AppText variant="bold">{invitation.tenant_name}</AppText>
        {' '}como {invitation.role}
      </AppText>

      <FormField
        label="Email"
        value={invitation.email}
        editable={false}
        style={{ opacity: 0.7 }}
      />

      <FormField
        label="Contraseña"
        required
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Crea una contraseña"
      />

      <Button fullWidth loading={loading} onPress={handleJoin} style={styles.btn}>
        Aceptar invitación
      </Button>
    </AuthTemplate>
  )
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginBottom: 8 },
  sub: { textAlign: 'center', marginBottom: 24 },
  btn: { marginTop: 8 },
})
