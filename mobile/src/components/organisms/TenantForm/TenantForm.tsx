import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useGetTenantQuery, useUpdateTenantMutation } from '../../../store/api/tenantsApi'
import { useGetTenantSettingsQuery, useUpdateTenantSettingsMutation } from '../../../store/api/tenantsApi'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { Spinner } from '../../atoms/Spinner'

interface TenantFormValues {
  name: string
  description: string
  whatsapp: string
  instagram: string
  address: string
}

export const TenantForm: React.FC = () => {
  const { data: tenant, isLoading: loadingTenant } = useGetTenantQuery()
  const { data: settings, isLoading: loadingSettings } = useGetTenantSettingsQuery()
  const [updateTenant, { isLoading: saving }] = useUpdateTenantMutation()
  const [updateSettings] = useUpdateTenantSettingsMutation()

  const { control, handleSubmit } = useForm<TenantFormValues>({
    values: {
      name: tenant?.name ?? '',
      description: tenant?.description ?? '',
      whatsapp: settings?.whatsapp ?? '',
      instagram: settings?.instagram ?? '',
      address: settings?.address ?? '',
    },
  })

  const onSubmit = async (data: TenantFormValues) => {
    await Promise.all([
      updateTenant({ name: data.name, description: data.description }),
      updateSettings({ whatsapp: data.whatsapp, instagram: data.instagram, address: data.address }),
    ])
  }

  if (loadingTenant || loadingSettings) return <Spinner fullScreen />

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <FormField
            label="Nombre de la tienda"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormField
            label="Descripción"
            value={field.value}
            onChangeText={field.onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <Controller
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <FormField
            label="WhatsApp"
            value={field.value}
            onChangeText={field.onChange}
            keyboardType="phone-pad"
            placeholder="+1234567890"
          />
        )}
      />

      <Controller
        control={control}
        name="instagram"
        render={({ field }) => (
          <FormField
            label="Instagram"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="@tutienda"
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <FormField
            label="Dirección"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Button fullWidth loading={saving} onPress={handleSubmit(onSubmit)}>
        Guardar cambios
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
})
