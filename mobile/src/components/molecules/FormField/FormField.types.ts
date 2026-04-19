import { InputProps } from '../../atoms/Input/Input.types'

export interface FormFieldProps extends InputProps {
  label: string
  error?: string
  required?: boolean
}
