import * as ImageManipulator from 'expo-image-manipulator'

export const compressImage = async (
  uri: string,
  maxWidth: number = 1200,
  quality: number = 0.85
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  )
  return result.uri
}
