import { TextInputProps } from 'react-native'

export interface InputProps extends TextInputProps {
  error?: string
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
