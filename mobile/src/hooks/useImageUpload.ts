import { useState } from 'react'
import { useSignImageMutation, useRegisterImageMutation } from '../store/api/imagesApi'

export const useImageUpload = (productId: string) => {
  const [signImage] = useSignImageMutation()
  const [registerImage] = useRegisterImageMutation()
  const [uploading, setUploading] = useState(false)

  const upload = async (localUri: string): Promise<string | null> => {
    setUploading(true)
    try {
      const { signature, timestamp, upload_preset, cloud_name } = await signImage(productId).unwrap()

      const formData = new FormData()
      formData.append('file', { uri: localUri, type: 'image/jpeg', name: 'photo.jpg' } as any)
      formData.append('signature', signature)
      formData.append('timestamp', String(timestamp))
      formData.append('upload_preset', upload_preset)

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: formData }
      )
      const cloudData = await cloudRes.json()

      await registerImage({
        productId,
        cloudinary_id: cloudData.public_id,
        url: cloudData.secure_url,
      }).unwrap()

      return cloudData.secure_url as string
    } catch (e) {
      console.error('Upload failed', e)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
