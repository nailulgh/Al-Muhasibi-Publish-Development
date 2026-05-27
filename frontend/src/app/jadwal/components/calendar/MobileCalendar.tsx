import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay,
    isToday
} from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarEvent } from '@/lib/calendarUtils'
import { clsx } from 'clsx'
import { useRef, useEffect } from 'react'

interface MobileCalendarProps {
    currentMonth: Date
    selectedDate: Date
    onDateSelect: (date: Date) => void
    events: CalendarEvent[]
    onEventClick: (event: CalendarEvent) => void
}

export default function MobileCalendar({
    currentMonth,
    selectedDate,
    onDateSelect,
    events,
    onEventClick
}: MobileCalendarProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    // Scroll to selected date on mount/change
    useEffect(() => {
        if (scrollRef.current) {
            const selectedEl = scrollRef.current.querySelector('[data-selected="true"]')
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [selectedDate])

    const selectedEvents = events.filter(event => isSameDay(event.date, selectedDate))

    return (
        <div className="flex flex-col gap-6">
            {/* Horizontal Date Strip */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
            >
                {days.map(day => {
                    const isSelected = isSameDay(day, selectedDate)
                    const isCurrentDay = isToday(day)
                    const hasEvents = events.some(e => isSameDay(e.date, day))

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onDateSelect(day)}
                            data-selected={isSelected}
                            className={clsx(
                                "flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all snap-center border",
                                isSelected
                                    ? "bg-[var(--accent-olive)] text-white border-[var(--accent-olive)] shadow-lg scale-105"
                                    : "bg-[var(--foreground)] border-[var(--border-color)] hover:border-[var(--accent-olive)]"
                            )}
                        >
                            <span className="text-xs font-medium opacity-80 uppercase">
                                {format(day, 'EEE', { locale: id })}
                            </span>
                            <span className={clsx("text-xl font-bold", isCurrentDay && !isSelected && "text-[var(--accent-olive)]")}>
                                {format(day, 'd')}
                            </span>
                            {hasEvents && (
                                <div className={clsx(
                                    "w-1.5 h-1.5 rounded-full mt-1",
                                    isSelected ? "bg-white" : "bg-[var(--accent-olive)]"
                                )} />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Event List for Selected Date */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--accent-olive)] px-1">
                    {format(selectedDate, 'EEEE, d MMMM', { locale: id })}
                </h3>

                {selectedEvents.length > 0 ? (
                    selectedEvents.map(event => (
                        <div
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="bg-[var(--foreground)] p-4 rounded-xl border border-[var(--border-color)] active:scale-95 transition-transform cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)]">{event.kegiatan}</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[var(--accent-olive)]"></span>
                                        {event.waktu}
                                    </p>
                                </div>
                                <div className="bg-[var(--accent-olive)]/10 text-[var(--accent-olive)] px-2 py-1 rounded text-xs font-medium">
                                    {event.tempat}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-[var(--foreground)]/50 rounded-xl border border-dashed border-[var(--border-color)] text-[var(--text-secondary)]">
                        <p>Tidak ada kegiatan pada tanggal ini.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
