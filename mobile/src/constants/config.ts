export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  requestTimeout: 15000,
  image: {
    maxWidth: 1200,
    quality: 0.85,
    maxFileSizeMb: 5,
  },
  pagination: {
    defaultPageSize: 20,
  },
}
