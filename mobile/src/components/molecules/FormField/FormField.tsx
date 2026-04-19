import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FormFieldProps } from './FormField.types'
import { Input } from '../../atoms/Input'
import { AppText } from '../../atoms/Text'
import { colors } from '../../../constants/theme'

export const FormField: React.FC<FormFieldProps> = ({ label, error, required, ...inputProps }) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>
        {label}
        {required && <AppText style={styles.required}> *</AppText>}
      </AppText>
      <Input error={error} {...inputProps} />
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, marginBottom: 6 },
  required: { color: colors.error },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
})
