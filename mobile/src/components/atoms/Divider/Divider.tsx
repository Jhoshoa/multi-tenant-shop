import React from 'react'
import { View } from 'react-native'
import { colors } from '../../../constants/theme'

interface DividerProps {
  marginVertical?: number
}

export const Divider: React.FC<DividerProps> = ({ marginVertical = 12 }) => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginVertical,
      }}
    />
  )
}
