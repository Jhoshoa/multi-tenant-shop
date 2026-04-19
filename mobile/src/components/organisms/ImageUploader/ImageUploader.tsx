import React from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { ProductImage } from '../../../types/models'
import { ImageThumb } from '../../molecules/ImageThumb'
import { Icon } from '../../atoms/Icon'
import { Spinner } from '../../atoms/Spinner'
import { useCamera } from '../../../hooks/useCamera'
import { useImageUpload } from '../../../hooks/useImageUpload'
import { useDeleteImageMutation } from '../../../store/api/imagesApi'
import { colors } from '../../../constants/theme'

interface ImageUploaderProps {
  productId: string
  images: ProductImage[]
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ productId, images }) => {
  const { openCamera, openGallery } = useCamera()
  const { upload, uploading } = useImageUpload(productId)
  const [deleteImage] = useDeleteImageMutation()

  const handleAdd = () => {
    Alert.alert('Agregar foto', undefined, [
      { text: 'Cámara', onPress: async () => { const uri = await openCamera(); if (uri) upload(uri) } },
      { text: 'Galería', onPress: async () => { const uri = await openGallery(); if (uri) upload(uri) } },
      { text: 'Cancelar', style: 'cancel' },
    ])
  }

  const handleDelete = (imageId: string) => {
    Alert.alert('Eliminar foto', '¿Eliminar esta imagen?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteImage({ productId, imageId }) },
    ])
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageThumb uri={item.url} order={item.order} onDelete={() => handleDelete(item.id)} />
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={uploading}>
            {uploading ? <Spinner size="small" /> : <Icon name="add" size={28} color={colors.muted} />}
          </TouchableOpacity>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  addBtn: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
