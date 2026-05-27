import { useState, useMemo } from 'react'
import { addMonths, subMonths, format } from 'date-fns'
import { id } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { generateCalendarEvents, CalendarEvent, Jadwal } from '@/lib/calendarUtils'
import DesktopCalendar from './DesktopCalendar'
import MobileCalendar from './MobileCalendar'
import EventDetailModal from './EventDetailModal'

interface CalendarViewProps {
    schedules: Jadwal[]
}

export default function CalendarView({ schedules }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Generate events mapped to dates
    const events = useMemo(() => {
        return generateCalendarEvents(schedules, currentMonth)
    }, [schedules, currentMonth])

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-8 bg-[var(--foreground)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[var(--accent-olive)]" />
                </button>

                <h2 className="text-xl font-bold text-[var(--accent-olive)] capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: id })}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-[var(--accent-olive)]" />
                </button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block animate-in fade-in duration-300">
                <DesktopCalendar
                    currentMonth={currentMonth}
                    events={events}
                    onEventClick={handleEventClick}
                />
            </div>

            {/* Mobile View */}
            <div className="md:hidden animate-in fade-in duration-300">
                <MobileCalendar
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    events={events}
                    onEventClick={handleEventClick}
                />
            </div>

            {/* Detail Modal */}
            <EventDetailModal
                isOpen={isModalOpen}
                event={selectedEvent}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
