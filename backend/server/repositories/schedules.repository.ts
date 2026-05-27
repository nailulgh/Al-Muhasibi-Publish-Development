import { createServerClient } from '../db/supabase'
import type { Schedule, CreateScheduleDto } from 'shared/types/schedule'

export const schedulesRepository = {
  async findAll(): Promise<Schedule[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('time_start', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async findById(id: string): Promise<Schedule | null> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  },

  async create(payload: CreateScheduleDto): Promise<Schedule> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .insert(payload)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, payload: Partial<CreateScheduleDto>): Promise<Schedule> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async deleteById(id: string): Promise<void> {
    const supabase = createServerClient()
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
