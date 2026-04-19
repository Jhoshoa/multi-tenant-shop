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

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate>
      <AppText variant="h2" style={styles.title}>Iniciar sesión</AppText>

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="tu@email.com"
      />

      <FormField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      <Button fullWidth loading={loading} onPress={handleLogin} style={styles.btn}>
        Iniciar sesión
      </Button>

      <Divider marginVertical={20} />

      <View style={styles.footer}>
        <AppText variant="muted">¿No tienes cuenta? </AppText>
        <Link href="/(auth)/register">
          <AppText style={{ color: colors.primary, fontWeight: '600' }}>Registrarme</AppText>
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
