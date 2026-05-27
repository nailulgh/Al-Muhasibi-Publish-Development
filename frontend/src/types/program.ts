export interface Program {
  id: string
  title: string
  description?: string
  icon_name?: string
  order?: number
  created_at?: string
}

export interface CreateProgramDto {
  title: string
  description?: string
  icon_name?: string
  order?: number
}

export interface UpdateProgramDto extends Partial<CreateProgramDto> {}
