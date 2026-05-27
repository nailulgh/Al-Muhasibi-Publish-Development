import CreatePengurusForm from './form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreatePengurusPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/profile" 
          className="p-2 hover:bg-[var(--foreground)] rounded-full transition-colors text-[var(--text-secondary)]"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Tambah Pengurus Baru</h1>
          <p className="text-[var(--text-secondary)]">Tambahkan anggota pengurus baru ke dalam profil</p>
        </div>
      </div>
      
      <CreatePengurusForm />
    </div>
  )
}
