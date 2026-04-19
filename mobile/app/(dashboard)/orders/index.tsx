import React from 'react'
import { ListTemplate } from '../../../src/components/templates/ListTemplate'
import { OrderList } from '../../../src/components/organisms/OrderList'

export default function OrdersScreen() {
  return (
    <ListTemplate title="Pedidos">
      <OrderList />
    </ListTemplate>
  )
}
