import { Linking } from 'react-native'
import { Order } from '../types/models'
import { formatCurrency } from './formatCurrency'

export const buildWhatsAppOrderLink = (order: Order, phone: string): string => {
  const items = order.items
    .map((i) => `• ${i.product_name} x${i.quantity} — ${formatCurrency(i.total_price)}`)
    .join('\n')

  const message = [
    `*Pedido #${order.id.slice(0, 8).toUpperCase()}*`,
    `Cliente: ${order.customer_name}`,
    '',
    items,
    '',
    `*Total: ${formatCurrency(order.total)}*`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encoded}`
}

export const openWhatsApp = async (order: Order, phone: string): Promise<void> => {
  const url = buildWhatsAppOrderLink(order, phone)
  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) await Linking.openURL(url)
}
