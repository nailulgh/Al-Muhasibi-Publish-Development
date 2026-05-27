import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday
} from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarEvent } from '@/lib/calendarUtils'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface DesktopCalendarProps {
    currentMonth: Date
    events: CalendarEvent[]
    onEventClick: (event: CalendarEvent) => void
}

export default function DesktopCalendar({ currentMonth, events, onEventClick }: DesktopCalendarProps) {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

    // Helper to get events for a specific day
    const getEventsForDay = (date: Date) => {
        return events.filter(event =>
            format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''))
    }

    return (
        <div className="bg-[var(--foreground)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            {/* Header Days */}
            <div className="grid grid-cols-7 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-[var(--accent-olive)]">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-[1fr]">
                {days.map((day, dayIdx) => {
                    const dayEvents = getEventsForDay(day)
                    const isCurrentMonth = isSameMonth(day, monthStart)

                    return (
                        <div
                            key={day.toString()}
                            className={twMerge(
                                clsx(
                                    "min-h-[120px] p-2 border-b border-r border-[var(--border-color)] transition-colors hover:bg-[var(--background)]/50",
                                    !isCurrentMonth && "bg-[var(--background)]/30 text-[var(--text-secondary)]/50",
                                    (dayIdx + 1) % 7 === 0 && "border-r-0" // Remove proper right border for last col
                                )
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={clsx(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                    isToday(day)
                                        ? "bg-[var(--accent-olive)] text-white"
                                        : "text-[var(--text-secondary)]"
                                )}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {dayEvents.map((event, idx) => (
                                    <button
                                        key={`${event.id}-${idx}`}
                                        onClick={() => onEventClick(event)}
                                        className="w-full text-left bg-[var(--accent-olive)]/10 hover:bg-[var(--accent-olive)]/20 border-l-2 border-[var(--accent-olive)] px-1.5 py-1 rounded text-xs truncate transition-all group"
                                    >
                                        <span className="font-medium text-[var(--accent-olive)] block truncate">
                                            {event.kegiatan}
                                        </span>
                                        <span className="text-[var(--text-secondary)] text-[10px] hidden group-hover:block">
                                            {event.waktu.split(' - ')[0]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
