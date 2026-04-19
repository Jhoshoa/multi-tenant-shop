import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Link } from 'expo-router'
import { AuthTemplate } from '../../src/components/templates/AuthTemplate'
import { FormField } from '../../src/components/molecules/FormField'
import { Button } from '../../src/components/atoms/Button'
import { AppText } from '../../src/components/atoms/Text'
import { Divider } from '../../src/components/atoms/Divider'
import { useAuth } from '../../src/hooks/useAuth'
import { colors } from '../../src/constants/theme'

export default function RegisterScreen() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    try {
      await register({
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
        tenant_name: tenantName.trim() || undefined,
      })
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate>
      <AppText variant="h2" style={styles.title}>Crear cuenta</AppText>

      <FormField
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Juan Pérez"
      />

      <FormField
        label="Nombre de tu tienda"
        value={tenantName}
        onChangeText={setTenantName}
        placeholder="Mi Tienda"
      />

      <FormField
        label="Email"
        required
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="tu@email.com"
      />

      <FormField
        label="Contraseña"
        required
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mínimo 6 caracteres"
      />

      <Button fullWidth loading={loading} onPress={handleRegister} style={styles.btn}>
        Crear cuenta
      </Button>

      <Divider marginVertical={20} />

      <View style={styles.footer}>
        <AppText variant="muted">¿Ya tienes cuenta? </AppText>
        <Link href="/(auth)/login">
          <AppText style={{ color: colors.primary, fontWeight: '600' }}>Iniciar sesión</AppText>
        </Link>
      </View>
    </AuthTemplate>
  )
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginBottom: 24 },
  btn: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
})
