import React from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import { InputProps } from './Input.types'
import { colors } from '../../../constants/theme'

export const Input: React.FC<InputProps> = ({
  error,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        error ? styles.errorBorder : styles.normalBorder,
      ]}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  normalBorder: { borderColor: colors.border },
  errorBorder: { borderColor: colors.error },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  icon: { marginHorizontal: 4 },
})
