export interface Pengurus {
  id: string
  nama: string
  jabatan: string
  asal: string
  jurusan: string
  devisi: string
  foto: string
  kategori: string
  created_at?: string
}

export interface CreatePengurusDto {
  nama: string
  jabatan: string
  asal: string
  jurusan: string
  devisi: string
  foto: string
  kategori?: string
}

export interface UpdatePengurusDto extends Partial<CreatePengurusDto> {}
