import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { AppText } from '../../atoms/Text'
import { Icon } from '../../atoms/Icon'
import { colors } from '../../../constants/theme'

interface CategoryChipProps {
  label: string
  selected: boolean
  onPress: () => void
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && <Icon name="checkmark" size={14} color={colors.primary} />}
      <AppText style={[styles.label, selected && styles.selectedLabel]}>{label}</AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  label: { fontSize: 13, color: colors.text.secondary },
  selectedLabel: { color: colors.primary, fontWeight: '600' },
})
