import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { AppText } from '../Text'
import { colors } from '../../../constants/theme'

interface AvatarProps {
  uri?: string | null
  name?: string
  size?: number
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40 }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <AppText style={{ color: '#fff', fontSize: size * 0.35, fontWeight: '700' }}>
        {initials}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  image: { resizeMode: 'cover' },
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
