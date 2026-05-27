import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay,
    parseISO,
    addMonths,
    subMonths
} from 'date-fns'
import { id } from 'date-fns/locale'
import type { Jadwal } from '@/types'
export type { Jadwal }

export interface CalendarEvent extends Jadwal {
    date: Date
}

// Map Indonesian day names to date-fns day index (0 = Sunday, 1 = Monday, etc.)
const dayMap: { [key: string]: number } = {
    'Minggu': 0,
    'Senin': 1,
    'Selasa': 2,
    'Rabu': 3,
    'Kamis': 4,
    'Jumat': 5,
    'Sabtu': 6
}

export const generateCalendarEvents = (schedules: Jadwal[], currentMonth: Date): CalendarEvent[] => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start, end })

    const events: CalendarEvent[] = []

    daysInMonth.forEach(date => {
        const dayName = format(date, 'eeee', { locale: id }) // 'Senin', 'Selasa', etc.

        // Find schedules that match this day name
        const daySchedules = schedules.filter(s => s.hari === dayName)

        daySchedules.forEach(schedule => {
            events.push({
                ...schedule,
                date: date
            })
        })
    })

    return events
}

export const getMonthName = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: id })
}
