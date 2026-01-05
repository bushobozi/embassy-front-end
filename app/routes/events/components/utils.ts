import type { EmbassyEvent, CalendarEvent } from "./types";

// Category color mapping
export const categoryColors: Record<string, string> = {
    CONFERENCE: "bg-blue-400",
    NATIONAL_DAY: "bg-purple-500",
    VISA_OUTREACH: "bg-green-400",
    CULTURAL_EVENT: "bg-pink-400",
    TRAINING: "bg-yellow-400",
    OTHER: "bg-gray-400",
};

// Convert EmbassyEvent to CalendarEvent format
export const convertToCalendarEvents = (
    events: EmbassyEvent[]
): CalendarEvent[] => {
    return events.map((event) => ({
        id: event.id,
        event_name: event.event_name,
        event_start_date: event.event_start_date,
        event_end_date: event.event_end_date,
        event_type: event.event_type,
        color: categoryColors[event.event_type] || "bg-gray-400",
        event_location: event.event_location,
        event_description: event.event_description,
        event_image: event.event_image,
        embassy_name: event.embassy_name,
        embassy_picture: event.embassy_picture,
    }));
};

// Get week dates starting from Sunday
export const getWeekDates = (currentDate: Date): Date[] => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
    }
    return dates;
};

// Month names array
export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// Helper function to calculate top position based on time
export const getTopPosition = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    const startHour = 6; // 6 AM
    const hoursPassed = hours - startHour + minutes / 60;
    return hoursPassed * 96; // 96px per hour (h-24 = 96px)
};

// Helper function to calculate height based on duration
export const getEventHeight = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const durationHours =
        endHours - startHours + (endMinutes - startMinutes) / 60;
    const calculatedHeight = durationHours * 96; // 96px per hour

    // Constrain height between minimum 60px and maximum 120px
    return Math.min(Math.max(calculatedHeight, 60), 120);
};

// Check if date is today
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// Format date to YYYY-MM-DD in local timezone (not UTC)
export const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
