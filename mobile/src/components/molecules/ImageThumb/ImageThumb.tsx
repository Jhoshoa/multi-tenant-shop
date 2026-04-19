import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface ImageThumbProps {
  uri: string
  order?: number
  onDelete: () => void
}

export const ImageThumb: React.FC<ImageThumbProps> = ({ uri, onDelete }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Icon name="close-circle" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: 80, height: 80, margin: 4 },
  image: { width: 80, height: 80, borderRadius: 8 },
  deleteBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.surface,
    borderRadius: 9999,
  },
})
