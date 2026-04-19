import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../constants/theme'

interface IconProps {
  name: React.ComponentProps<typeof Ionicons>['name']
  size?: number
  color?: string
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = colors.text.primary }) => {
  return <Ionicons name={name} size={size} color={color} />
}
