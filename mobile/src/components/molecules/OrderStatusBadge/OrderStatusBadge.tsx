import React from 'react'
import { Badge } from '../../atoms/Badge'
import { ORDER_STATUSES } from '../../../constants/orderStatuses'
import { OrderStatus } from '../../../types/models'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = ORDER_STATUSES[status]
  return <Badge label={config.label} color={config.color} bgColor={config.bgColor} />
}
