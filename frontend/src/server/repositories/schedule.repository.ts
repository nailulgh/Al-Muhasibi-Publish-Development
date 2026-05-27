import { createServerClient } from '@/server/db/supabase'
import type { Schedule, CreateScheduleDto } from '@/types/schedule'

export const scheduleRepository = {
  async findAll(): Promise<Schedule[]> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('time_start', { ascending: true })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async findById(id: string): Promise<Schedule | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }
}
