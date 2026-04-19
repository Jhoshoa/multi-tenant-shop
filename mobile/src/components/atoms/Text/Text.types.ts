import { TextProps } from 'react-native'

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'bold' | 'muted'

export interface AppTextProps extends TextProps {
  variant?: TextVariant
}
