import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { AppSwitch } from '../../atoms/Switch'
import { AppText } from '../../atoms/Text'
import { CreateProductDto } from '../../../types/models'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number({ invalid_type_error: 'Ingresa un precio válido' }).min(0),
  compare_at_price: z.number().optional(),
  sku: z.string().optional(),
  track_inventory: z.boolean().optional(),
  stock: z.number().optional(),
  low_stock_threshold: z.number().optional(),
})

type FormValues = z.infer<typeof schema>

interface ProductFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: CreateProductDto) => Promise<void>
  isLoading?: boolean
}

export const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { track_inventory: false, stock: 0, low_stock_threshold: 5, ...defaultValues },
  })

  const trackInventory = watch('track_inventory')

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <FormField
            label="Nombre"
            required
            error={errors.name?.message}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej. Camiseta azul"
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
            placeholder="Descripción del producto..."
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <FormField
            label="Precio"
            required
            error={errors.price?.message}
            value={field.value?.toString()}
            onChangeText={(t) => field.onChange(parseFloat(t) || 0)}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        )}
      />

      <Controller
        control={control}
        name="compare_at_price"
        render={({ field }) => (
          <FormField
            label="Precio original (opcional)"
            value={field.value?.toString()}
            onChangeText={(t) => field.onChange(parseFloat(t) || undefined)}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        )}
      />

      <Controller
        control={control}
        name="sku"
        render={({ field }) => (
          <FormField
            label="SKU (opcional)"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="ABC-123"
          />
        )}
      />

      <View style={styles.row}>
        <AppText variant="bold">Controlar inventario</AppText>
        <Controller
          control={control}
          name="track_inventory"
          render={({ field }) => (
            <AppSwitch value={field.value} onValueChange={field.onChange} />
          )}
        />
      </View>

      {trackInventory && (
        <>
          <Controller
            control={control}
            name="stock"
            render={({ field }) => (
              <FormField
                label="Stock actual"
                value={field.value?.toString()}
                onChangeText={(t) => field.onChange(parseInt(t) || 0)}
                keyboardType="number-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="low_stock_threshold"
            render={({ field }) => (
              <FormField
                label="Umbral stock bajo"
                value={field.value?.toString()}
                onChangeText={(t) => field.onChange(parseInt(t) || 5)}
                keyboardType="number-pad"
              />
            )}
          />
        </>
      )}

      <Button
        fullWidth
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        style={styles.submitBtn}
      >
        Guardar producto
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitBtn: { marginTop: 8 },
})
