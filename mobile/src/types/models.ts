export interface Tenant {
  id: string
  slug: string
  name: string
  description: string | null
  currency: string
  plan: string
  is_active: boolean
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  rejected_reason: string | null
  created_at: string
}

export interface TenantSettings {
  tenant_id: string
  whatsapp: string | null
  instagram: string | null
  address: string | null
  business_hours: Record<string, string> | null
  logo_url: string | null
}

export interface User {
  id: string
  supabase_id: string
  email: string
  full_name: string | null
  role: 'owner' | 'staff' | 'superadmin'
  tenant_id: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  tenant_id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  cloudinary_id: string
  url: string
  order: number
  created_at: string
}

export interface Product {
  id: string
  tenant_id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  is_active: boolean
  track_inventory: boolean
  stock: number
  low_stock_threshold: number
  images: ProductImage[]
  category: Category | null
  created_at: string
  updated_at: string
}

export interface ProductFilters {
  page?: number
  page_size?: number
  category_id?: string
  search?: string
  is_active?: boolean
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  compare_at_price?: number
  sku?: string
  category_id?: string
  track_inventory?: boolean
  stock?: number
  low_stock_threshold?: number
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface InventoryEntry {
  id: string
  product_id: string
  quantity_change: number
  reason: string
  created_by: string
  created_at: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  tenant_id: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  status: OrderStatus
  total: number
  notes: string | null
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  tenant_id: string
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}
