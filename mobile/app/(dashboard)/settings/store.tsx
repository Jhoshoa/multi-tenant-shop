import React from 'react'
import { FormTemplate } from '../../../src/components/templates/FormTemplate'
import { TenantForm } from '../../../src/components/organisms/TenantForm'

export default function StoreSettingsScreen() {
  return (
    <FormTemplate title="Configuración de la tienda">
      <TenantForm />
    </FormTemplate>
  )
}
