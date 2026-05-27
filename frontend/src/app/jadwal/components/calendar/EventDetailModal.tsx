import { X, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarEvent } from '@/lib/calendarUtils'

interface EventDetailModalProps {
    event: CalendarEvent | null
    isOpen: boolean
    onClose: () => void
}

export default function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
    if (!isOpen || !event) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-[var(--foreground)] w-full max-w-md rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-24 bg-[var(--accent-olive)]/10 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <CalendarIcon className="w-10 h-10 text-[var(--accent-olive)]" />
                </div>

                {/* Content */}
                <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-olive)]/10 text-[var(--accent-olive)] mb-3">
                        {event.kategori}
                    </span>

                    <h2 className="text-2xl font-bold text-[var(--accent-olive)] mb-1">
                        {event.kegiatan}
                    </h2>

                    <p className="text-[var(--text-secondary)] font-medium mb-6">
                        {format(event.date, 'EEEE, d MMMM yyyy', { locale: id })}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                            <Clock className="w-5 h-5 text-[var(--accent-olive)] mt-0.5" />
                            <div>
                                <p className="font-semibold text-[var(--text-primary)]">Waktu</p>
                                <p>{event.waktu}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                            <MapPin className="w-5 h-5 text-[var(--accent-olive)] mt-0.5" />
                            <div>
                                <p className="font-semibold text-[var(--text-primary)]">Tempat</p>
                                <p>{event.tempat}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--background)]/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-[var(--accent-olive)] text-white hover:brightness-110 transition-all font-medium text-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}
