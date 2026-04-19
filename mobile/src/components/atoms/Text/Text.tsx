import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { AppTextProps } from './Text.types'
import { colors } from '../../../constants/theme'

const variantStyles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700', color: colors.text.primary },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text.primary },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  body: { fontSize: 15, fontWeight: '400', color: colors.text.primary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.text.secondary },
  bold: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  muted: { fontSize: 14, fontWeight: '400', color: colors.muted },
})

export const AppText: React.FC<AppTextProps> = ({ variant = 'body', style, ...props }) => {
  return <Text style={[variantStyles[variant], style]} {...props} />
}
