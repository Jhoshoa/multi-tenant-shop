import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

interface CameraOptions {
  maxWidth?: number
  quality?: number
}

export const useCamera = ({ maxWidth = 1200, quality = 0.85 }: CameraOptions = {}) => {
  const compress = async (uri: string): Promise<string> => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    )
    return result.uri
  }

  const openCamera = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') return null

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (result.canceled) return null

    return compress(result.assets[0].uri)
  }

  const openGallery = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return null

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
    })
    if (result.canceled) return null

    return compress(result.assets[0].uri)
  }

  return { openCamera, openGallery }
}
