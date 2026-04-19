import React from 'react'
import { Switch as RNSwitch, SwitchProps } from 'react-native'
import { colors } from '../../../constants/theme'

export const AppSwitch: React.FC<SwitchProps> = (props) => {
  return (
    <RNSwitch
      trackColor={{ false: colors.border, true: colors.primaryLight }}
      thumbColor={props.value ? colors.primary : '#f4f3f4'}
      ios_backgroundColor={colors.border}
      {...props}
    />
  )
}
