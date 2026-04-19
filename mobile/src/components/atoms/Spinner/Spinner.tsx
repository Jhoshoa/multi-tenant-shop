import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { colors } from '../../../constants/theme'

interface SpinnerProps {
  size?: 'small' | 'large'
  color?: string
  fullScreen?: boolean
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  color = colors.primary,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    )
  }
  return <ActivityIndicator size={size} color={color} />
}
