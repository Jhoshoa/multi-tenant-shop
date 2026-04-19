import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenTemplate } from '../../src/components/templates/ScreenTemplate'
import { Button } from '../../src/components/atoms/Button'
import { AppText } from '../../src/components/atoms/Text'
import { Icon } from '../../src/components/atoms/Icon'
import { useCamera } from '../../src/hooks/useCamera'
import { useAppDispatch } from '../../src/store/hooks'
import { addImage } from '../../src/store/slices/cameraSlice'
import { colors } from '../../src/constants/theme'

export default function CameraScreen() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { openCamera, openGallery } = useCamera()

  const handleCapture = async (source: 'camera' | 'gallery') => {
    const uri = source === 'camera' ? await openCamera() : await openGallery()
    if (!uri) return
    dispatch(addImage({ uri }))
    Alert.alert('Foto guardada', 'La foto está lista para asignar a un producto.')
    router.push('/(dashboard)/products')
  }

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <Icon name="camera" size={64} color={colors.primary} />
        <AppText variant="h2" style={styles.title}>Capturar foto</AppText>
        <AppText variant="muted" style={styles.sub}>
          Toma una foto o elige de tu galería para agregarla a un producto.
        </AppText>

        <Button fullWidth onPress={() => handleCapture('camera')} style={styles.btn}>
          Abrir cámara
        </Button>
        <Button fullWidth variant="outline" onPress={() => handleCapture('gallery')} style={styles.btn}>
          Elegir de galería
        </Button>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { textAlign: 'center' },
  sub: { textAlign: 'center', marginBottom: 16 },
  btn: {},
})
