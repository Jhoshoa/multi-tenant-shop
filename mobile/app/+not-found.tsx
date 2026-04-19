import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { AppText } from '../src/components/atoms/Text'
import { colors } from '../src/constants/theme'

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h2">Página no encontrada</AppText>
      <Link href="/(auth)/login" style={styles.link}>
        <AppText style={{ color: colors.primary }}>Volver al inicio</AppText>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  link: { marginTop: 8 },
})
