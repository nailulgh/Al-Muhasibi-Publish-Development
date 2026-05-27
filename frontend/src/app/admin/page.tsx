import React from 'react'
import { fetchGallery } from '@/lib/api/gallery'
import { ImageIcon, Calendar, Users, Activity } from 'lucide-react'
import { fetchPrograms } from '@/lib/api/programs'

export default async function AdminDashboard() {
  // Fetch verified counts
  const galleryCount = (await fetchGallery()).length
  const programsCount = (await fetchPrograms()).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-heading">Dashboard Overview</h1>
        <p className="text-[var(--text-secondary)] mt-2">Selamat datang kembali, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Galeri" 
          value={galleryCount || 0} 
          icon={<ImageIcon className="w-8 h-8 text-blue-500" />} 
          description="Total dokumentasi"
        />
        <StatCard 
          title="Featured Programs" 
          value={programsCount || 0} 
          icon={<Activity className="w-8 h-8 text-purple-500" />} 
          description="Active programs"
        />
        <StatCard 
          title="Today's Schedule" 
          value={0} 
          icon={<Calendar className="w-8 h-8 text-green-500" />} 
          description="Scheduled events"
        />
        <StatCard 
          title="Total Residents" 
          value="-" 
          icon={<Users className="w-8 h-8 text-orange-500" />} 
          description="Data unavailable"
        />
      </div>

      <div className="bg-[var(--foreground)] p-6 rounded-xl border border-[var(--border-color)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Activity</h2>
        <div className="text-[var(--text-secondary)] text-center py-8">
          No recent activity recorded.
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, description }: { title: string, value: number | string, icon: React.ReactNode, description: string }) {
  return (
    <div className="bg-[var(--foreground)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-[var(--background)] rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-4">{description}</p>
    </div>
  )
}
