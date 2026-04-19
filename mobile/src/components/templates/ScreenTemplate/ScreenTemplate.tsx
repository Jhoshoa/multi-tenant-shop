import React from 'react'
import { SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native'
import { colors } from '../../../constants/theme'

interface ScreenTemplateProps {
  children: React.ReactNode
  scrollable?: boolean
}

export const ScreenTemplate: React.FC<ScreenTemplateProps> = ({
  children,
  scrollable = true,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollable ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 16 },
})
