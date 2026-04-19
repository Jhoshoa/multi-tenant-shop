import React from 'react'
import { SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { Header } from '../../organisms/Header'
import { colors } from '../../../constants/theme'

interface FormTemplateProps {
  title: string
  children: React.ReactNode
}

export const FormTemplate: React.FC<FormTemplateProps> = ({ title, children }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <Header title={title} showBack />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
})
