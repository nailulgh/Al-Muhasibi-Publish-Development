import { createServerClient } from '../db/supabase'
import type { Program, CreateProgramDto, UpdateProgramDto } from 'shared/types/program'

export const programsRepository = {
  async findAll(): Promise<Program[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('order', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async findById(id: string): Promise<Program | null> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  },

  async create(payload: CreateProgramDto): Promise<Program> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .insert(payload)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, payload: UpdateProgramDto): Promise<Program> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('programs')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async deleteById(id: string): Promise<void> {
    const supabase = createServerClient()
    const { error } = await supabase.from('programs').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
