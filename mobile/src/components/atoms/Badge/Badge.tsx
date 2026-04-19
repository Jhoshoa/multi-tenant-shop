import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '../Text'

interface BadgeProps {
  label: string
  color: string
  bgColor: string
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bgColor }) => {
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <AppText style={[styles.text, { color }]}>{label}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600' },
})
