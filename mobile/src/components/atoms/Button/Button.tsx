import React from 'react'
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native'
import { ButtonProps } from './Button.types'
import { colors } from '../../../constants/theme'
import { AppText } from '../Text'

const variantStyles = {
  primary: { bg: colors.primary, text: '#fff', border: colors.primary },
  secondary: { bg: colors.primaryLight, text: colors.primaryDark, border: colors.primaryLight },
  outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', text: colors.primary, border: 'transparent' },
  danger: { bg: colors.error, text: '#fff', border: colors.error },
}

const sizeStyles = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 15 },
  lg: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 17 },
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}) => {
  const vs = variantStyles[variant]
  const ss = sizeStyles[size]

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.text} />
      ) : (
        <AppText style={{ color: vs.text, fontSize: ss.fontSize, fontWeight: '600' }}>
          {children}
        </AppText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
})
