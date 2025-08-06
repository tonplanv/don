import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Banner = {
  id: string
  title?: string
  description?: string
  media_url: string
  media_type: 'image' | 'video'
  video_url?: string
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}