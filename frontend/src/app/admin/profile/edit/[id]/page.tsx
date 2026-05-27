import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditPengurusForm from './form'
import { fetchPengurusById } from '@/lib/api/pengurus'

export default async function EditPengurusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let pengurus = null
    try {
        pengurus = await fetchPengurusById(id)
    } catch (e) {
        notFound()
    }

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
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Edit Pengurus</h1>
                    <p className="text-[var(--text-secondary)]">Edit data pengurus: {pengurus.nama}</p>
                </div>
            </div>

            <EditPengurusForm pengurus={pengurus} />
        </div>
    )
}
