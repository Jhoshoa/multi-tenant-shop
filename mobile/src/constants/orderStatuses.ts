import { OrderStatus } from '../types/models'

interface StatusConfig {
  label: string
  color: string
  bgColor: string
}

export const ORDER_STATUSES: Record<OrderStatus, StatusConfig> = {
  pending: { label: 'Pendiente', color: '#92400e', bgColor: '#fef3c7' },
  confirmed: { label: 'Confirmado', color: '#1e40af', bgColor: '#dbeafe' },
  processing: { label: 'En proceso', color: '#6b21a8', bgColor: '#f3e8ff' },
  shipped: { label: 'Enviado', color: '#0f766e', bgColor: '#ccfbf1' },
  delivered: { label: 'Entregado', color: '#166534', bgColor: '#dcfce7' },
  cancelled: { label: 'Cancelado', color: '#991b1b', bgColor: '#fee2e2' },
}
