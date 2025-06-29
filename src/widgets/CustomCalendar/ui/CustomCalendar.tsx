// src/widgets/CustomCalendar/ui/CustomCalendar.tsx
import React, {useState} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,} from "@heroui/react";

type CalendarEvent = {
    title: string;
    color: string;
    time?: string;
    speaker?: string;
    date: string;
};

export const CustomCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const allEvents: CalendarEvent[] = [
        { title: "One on One", color: "rgb(255,107,53)", time: "11:00", speaker: "Мария К.", date: "2025-06-03T11:00:00.000Z" },
        { title: "Митап", color: "rgb(0,48,73)", time: "15:30", speaker: "Алексей П.", date: "2025-06-07T15:30:00.000Z" },
        { title: "Тимбилдинг", color: "rgb(168,8,31)", time: "10:00", speaker: "HR-команда", date: "2025-06-12T10:00:00.000Z" },
        { title: "Митап", color: "rgb(0,48,73)", time: "16:00", date: "2025-06-12T16:00:00.000Z" },
        { title: "Встреча", color: "rgb(0,112,244)", time: "17:00", date: "2025-06-18T17:00:00.000Z" },
        { title: "Проект А", color: "rgb(120,50,200)", date: "2025-07-05T09:00:00.000Z" },
        { title: "Отчет B", color: "rgb(20,150,80)", date: "2025-05-28T14:00:00.000Z" },
        // Events for current date (June 29, 2025)
        { title: "Игровой Вечер", color: "rgb(70, 130, 180)", date: "2025-06-29T19:00:00.000Z" },
        { title: "Кофе-Брейк", color: "rgb(255, 215, 0)", date: "2025-06-29T10:00:00.000Z" },
    ];

    const goToPreviousMonth = () => setCurrentDate(prevDate => {
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, prevDate.getDate());
        const lastDayOfNewMonth = new Date(prevDate.getFullYear(), prevDate.getMonth(), 0).getDate();
        return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, Math.min(prevDate.getDate(), lastDayOfNewMonth));
    });

    const goToNextMonth = () => setCurrentDate(prevDate => {
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate());
        const lastDayOfNewMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 2, 0).getDate();
        return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, Math.min(prevDate.getDate(), lastDayOfNewMonth));
    });

    const calendarCells = [];

    for (let i = firstDayIndex; i > 0; i--) {
        const day = prevMonthDays - i + 1;
        calendarCells.push(
            <div key={`prev-${day}`} className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                {day}
            </div>
        );
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        const dayEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        calendarCells.push(
            <div
                key={day}
                onClick={() => {
                    const filteredEvents = dayEvents.sort((a, b) => { // Sort events by time
                        if (a.time && b.time) {
                            return a.time.localeCompare(b.time);
                        }
                        return 0;
                    });
                    setSelectedDayEvents(filteredEvents); // Set events for modal
                    onOpen();
                }}
                className={`
                    px-0.5 py-1 text-center cursor-pointer text-gray-800 text-base font-semibold
                    h-10 flex flex-col items-center justify-center relative
                    hover:bg-gray-200 hover:rounded-md transition-colors duration-150
                `}
            >
                <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full 
                    ${isToday ? "bg-blue-500 text-white font-bold" : ""}`}> {/* Changed to circle */}
                    {day}
                </span>
                {dayEvents.length > 0 && (
                    <div className="mt-1 flex gap-1 justify-center">
                        {dayEvents.slice(0, 3).map((e, idx) => ( // Show max 3 dots for events
                            <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                        ))}
                        {dayEvents.length > 3 && ( // Add a dot if more than 3 events
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                    </div>
                )}
            </div>
        );
    }

    const remainingCells = 7 - (calendarCells.length % 7);
    if (remainingCells < 7 && remainingCells > 0) {
        for (let i = 1; i <= remainingCells; i++) {
            calendarCells.push(
                <div key={`next-${i}`} className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                    {i}
                </div>
            );
        }
    }
    const displayTodaysFullDate = today.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const displayMonthYear = currentDate.toLocaleString('ru-RU', {
        month: 'long',
        year: 'numeric'
    });
    return (
        <div className="w-full max-w-[350px] bg-white rounded-lg shadow-md p-5">
            {/* Header */}
            <div className="flex flex-col mb-4">
                <div className="text-gray-600 text-sm font-medium mb-1">
                    {displayTodaysFullDate}
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {displayMonthYear.charAt(0).toUpperCase() + displayMonthYear.slice(1)}
                    </h2>
                    <div className="flex gap-1">
                        <Button
                            onPress={goToPreviousMonth}
                            isIconOnly
                            className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md transition-colors duration-200 flex items-center justify-center p-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </Button>
                        <Button
                            onPress={goToNextMonth}
                            isIconOnly
                            className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md transition-colors duration-200 flex items-center justify-center p-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 overflow-x-hidden">{calendarCells}</div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-semibold text-gray-800">
                                События на {selectedDayEvents.length > 0 ? new Date(selectedDayEvents[0].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </ModalHeader>
                            <ModalBody className="space-y-3 text-sm text-gray-800">
                                {selectedDayEvents.length > 0 ? (
                                    <ul className="space-y-2">
                                        {selectedDayEvents.map((e, idx) => (
                                            <li key={idx} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                                                    {e.title}
                                                </div>
                                                {e.time && <div className="text-gray-600 pl-5">Время: {e.time}</div>}
                                                {e.speaker && <div className="text-gray-600 pl-5">Спикер: {e.speaker}</div>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Событий нет</p>
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