import { createServerClient } from '@/server/db/supabase'
import type { Program, CreateProgramDto, UpdateProgramDto } from '@/types/program'

export const programRepository = {
  async count(): Promise<number> {
    const supabase = await createServerClient()
    const { count, error } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true })

    if (error) throw new Error(error.message)
    return count ?? 0
  },

  async findAll(): Promise<Program[]> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .select('id, title, description, icon_name, order, created_at')
      .order('order', { ascending: true })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async findById(id: string): Promise<Program | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async create(dto: CreateProgramDto): Promise<Program> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, dto: UpdateProgramDto): Promise<Program> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('programs')
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
      .from('programs')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }
}
