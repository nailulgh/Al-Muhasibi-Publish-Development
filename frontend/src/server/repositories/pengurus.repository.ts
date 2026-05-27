import { createServerClient } from '@/server/db/supabase'
import type { Pengurus, CreatePengurusDto, UpdatePengurusDto } from '@/types/pengurus'

export const pengurusRepository = {
  async findAll(): Promise<Pengurus[]> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('pengurus')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async findById(id: string): Promise<Pengurus | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('pengurus')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async create(dto: CreatePengurusDto): Promise<Pengurus> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('pengurus')
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, dto: UpdatePengurusDto): Promise<Pengurus> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('pengurus')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('pengurus')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }
}
