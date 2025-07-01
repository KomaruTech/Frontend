import React, { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { fetchEvents, type ApiEvent, type EventType } from "@features/calendary/api/calendaryApi.ts"; // Adjust path as needed

// --- HELPER FUNCTION FOR COLOR ---
const getColorForType = (type: EventType): string => {
    switch (type) {
        case "personal":
            return "rgb(200, 50, 50)"; // Red
        case "group":
            return "rgb(255, 193, 7)";  // Yellow/Amber
        case "general":
        default:
            return "rgb(0, 112, 244)"; // Blue
    }
};

// Type for event used within the component for display
type DisplayEvent = {
    title: string;
    color: string; // Color now depends on type
    date: string;  // ISO string timeStart for day filtering
    startTime: string; // Start time in HH:mm format
    endTime: string;   // End time in HH:mm format
    location: string;
    createdBy: string; // Could be a name or a more descriptive string
    type: EventType; // Add type for display in modal
};

// Translations for event types
const typeTranslations: Record<EventType, string> = {
    general: "Общее",
    personal: "Личное",
    group: "Групповое",
};

export const CustomCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<DisplayEvent[]>([]);
    const [selectedDayEvents, setSelectedDayEvents] = useState<DisplayEvent[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const apiEvents = await fetchEvents();
                // Transform API data into display format
                const formattedEvents = apiEvents.map((event: ApiEvent): DisplayEvent => ({
                    title: event.name,
                    color: getColorForType(event.type),
                    date: event.timeStart,
                    startTime: new Date(event.timeStart).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    endTime: new Date(event.timeEnd).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    location: event.location,
                    // Improve `createdBy` display from raw ID
                    createdBy: event.createdById === "3fa85f64-5717-4562-b3fc-2c963f66afa6"
                        ? "Система (Тестовый)" // Example for known test ID
                        : event.createdById, // Fallback to ID if no better info, or replace with "Неизвестно"
                    type: event.type,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to load events:", error);
                // Optionally show a user-friendly error message in the UI
            }
        };

        loadEvents();
    }, []);

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    // getDay() returns 0 for Sunday, 1 for Monday, etc. We want 0 for Monday for correct grid alignment
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Monday=1, etc.
    const normalizedFirstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1; // Convert to Monday=0, Sunday=6

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]; // Start from Monday for display

    const goToPreviousMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));

    const calendarCells = [];

    // Days from previous month (fill leading empty cells)
    for (let i = normalizedFirstDayIndex; i > 0; i--) {
        const day = prevMonthDays - i + 1;
        calendarCells.push(
            <div key={`prev-${day}`} className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                {day}
            </div>
        );
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        // Get unique colors for events on this day
        const uniqueColors = Array.from(new Set(dayEvents.map(e => e.color)));

        calendarCells.push(
            <div
                key={day}
                onClick={() => {
                    if (dayEvents.length === 0) return; // Only open modal if there are events
                    const sortedEvents = [...dayEvents].sort((a, b) => a.startTime.localeCompare(b.startTime));
                    setSelectedDayEvents(sortedEvents);
                    onOpen();
                }}
                className={`
                    px-0.5 py-1 text-center text-gray-800 text-base font-semibold
                    h-10 flex flex-col items-center justify-center relative transition-colors duration-150
                    ${dayEvents.length > 0 ? "cursor-pointer hover:bg-gray-200 hover:rounded-md" : ""}
                `}
            >
                <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full
                    ${isToday ? "bg-blue-500 text-white font-bold" : ""}`}>
                    {day}
                </span>
                {uniqueColors.length > 0 && (
                    <div className="mt-1 flex gap-1 justify-center">
                        {/* Show up to 3 unique colored dots */}
                        {uniqueColors.slice(0, 3).map((color, idx) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                        {/* If more than 3 unique event types, show a gray dot */}
                        {uniqueColors.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Days from next month (fill trailing empty cells)
    const totalCells = calendarCells.length;
    const remainingCells = (7 - (totalCells % 7)) % 7; // Ensure we only add if needed and correct modulo
    if (remainingCells > 0) {
        for (let i = 1; i <= remainingCells; i++) {
            calendarCells.push(
                <div key={`next-${i}`} className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                    {i}
                </div>
            );
        }
    }

    const displayTodaysFullDate = today.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const displayMonthYear = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full max-w-[350px] bg-white rounded-lg shadow-md p-5">
            <div className="flex flex-col mb-4">
                <div className="text-gray-600 text-sm font-medium mb-1">{displayTodaysFullDate}</div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">{displayMonthYear.charAt(0).toUpperCase() + displayMonthYear.slice(1)}</h2>
                    <div className="flex gap-1">
                        <Button onPress={goToPreviousMonth} isIconOnly className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </Button>
                        <Button onPress={goToNextMonth} isIconOnly className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </Button>
                    </div>
                </div>
            </div>
            {/* Weekday headers, adjusted to start from Monday */}
            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                {weekDays.map((day) => <div key={day} className="py-1">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 overflow-x-hidden">{calendarCells}</div>

            {/* Event Details Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-semibold text-gray-800">
                                События на {selectedDayEvents.length > 0 ? new Date(selectedDayEvents[0].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </ModalHeader>
                            <ModalBody className="space-y-4 text-sm text-gray-800">
                                {selectedDayEvents.length > 0 ? (
                                    <ul className="space-y-3">
                                        {selectedDayEvents.map((e, idx) => (
                                            <li key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                                <div className="flex items-center gap-3 font-semibold text-base mb-1">
                                                    {/* Dot with event color */}
                                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                                                    {e.title}
                                                </div>
                                                <div className="pl-[22px] text-gray-600 space-y-1">
                                                    <div><strong>Тип:</strong> {typeTranslations[e.type]}</div>
                                                    <div><strong>Время:</strong> {e.startTime} - {e.endTime}</div>
                                                    <div><strong>Место:</strong> {e.location}</div>
                                                    {e.createdBy && <div><strong>Организатор:</strong> {e.createdBy}</div>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">На этот день событий нет.</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};