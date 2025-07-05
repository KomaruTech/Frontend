import React, {useState, useEffect, useMemo} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@heroui/react";
import {fetchEvents, type ApiEvent, type EventType} from "@features/calendary/api/calendaryApi.ts";

const getColorForType = (type: EventType): string => {
    switch (type) {
        case "personal":
            return "rgb(200, 50, 50)";
        case "group":
            return "rgb(255, 193, 7)";
        case "general":
        default:
            return "rgb(0, 112, 244)";
    }
};

type DisplayEvent = {
    title: string;
    color: string;
    date: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    createdBy: string;
    type: EventType;
};

const typeTranslations: Record<EventType, string> = {
    general: "Общее",
    personal: "Личное",
    group: "Групповое",
};

export const CustomCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<DisplayEvent[]>([]);
    const [selectedDayEvents, setSelectedDayEvents] = useState<DisplayEvent[]>([]);
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const apiEvents = await fetchEvents();
                const confirmed = apiEvents.filter(e => e.status === 'confirmed');
                if (Array.isArray(confirmed)) {
                    const formattedEvents = confirmed.map((event: ApiEvent): DisplayEvent => {
                        const startDate = new Date(event.timeStart);
                        const endDate = new Date(event.timeEnd);
                        return {
                            title: event.name,
                            color: getColorForType(event.type),
                            date: event.timeStart,
                            startDate,
                            endDate,
                            startTime: startDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
                            endTime: endDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
                            location: event.location,
                            createdBy: event.createdById,
                            type: event.type,
                        };
                    });
                    setEvents(formattedEvents);
                } else {
                    console.error("fetchEvents did not return an array:", confirmed);
                    setEvents([]);
                }
            } catch (error) {
                console.error("Failed to load events:", error);
                setEvents([]);
            }
        };

        loadEvents();
    }, []);

    const today = useMemo(() => new Date(), []);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const normalizedFirstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const goToPreviousMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));

    const calendarCells = [];

    for (let i = normalizedFirstDayIndex; i > 0; i--) {
        const day = prevMonthDays - i + 1;
        calendarCells.push(
            <div key={`prev-${day}`}
                 className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                {day}
            </div>
        );
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        const dayEvents = events.filter(event => {
            const eventDate = event.startDate;
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        const uniqueColors = Array.from(new Set(dayEvents.map(e => e.color)));

        calendarCells.push(
            <div
                key={day}
                onClick={() => {
                    if (dayEvents.length === 0) return;
                    const sortedEvents = [...dayEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
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
                        {uniqueColors.slice(0, 3).map((color, idx) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}/>
                        ))}
                        {uniqueColors.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"/>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const totalCells = calendarCells.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    if (remainingCells > 0) {
        for (let i = 1; i <= remainingCells; i++) {
            calendarCells.push(
                <div key={`next-${i}`}
                     className="px-0.5 py-1 text-center text-gray-400 cursor-not-allowed text-base font-semibold h-10 flex flex-col items-center justify-center">
                    {i}
                </div>
            );
        }
    }

    // Форматирование корректное, но выделяем функцию для заглавной буквы (учтём, если месяц уже с большой)
    function capitalize(word: string) {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const displayTodaysFullDate = today.toLocaleString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'});
    const displayMonthYear = capitalize(currentDate.toLocaleString('ru-RU', {month: 'long', year: 'numeric'}));

    return (
        <div className="w-full max-w-[350px] bg-white rounded-lg shadow-md p-5">
            <div className="flex flex-col mb-4">
                <div className="text-gray-600 text-sm font-medium mb-1">{displayTodaysFullDate}</div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">{displayMonthYear}</h2>
                    <div className="flex gap-1">
                        <Button onPress={goToPreviousMonth} isIconOnly
                                className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </Button>
                        <Button onPress={goToNextMonth} isIconOnly
                                className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((wd, idx) => (
                    <div key={idx} className="text-center text-gray-500 font-semibold text-xs uppercase">{wd}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarCells}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onClose}>
                <ModalContent>
                    <ModalHeader>События дня</ModalHeader>
                    <ModalBody className="break-words break-all">
                        {selectedDayEvents.length === 0 ? (
                            <div>Нет событий на этот день.</div>
                        ) : (
                            selectedDayEvents.map((event, idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="flex items-center gap-2">
          <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: event.color }}
          />
                                        <span className="font-bold">{event.title}</span>
                                    </div>

                                    <div className="text-sm text-gray-500 mt-1">
                                        <div>
                                            <span className="font-medium">Время:</span> {event.startTime} — {event.endTime}
                                        </div>
                                        <div>
                                            <span className="font-medium">Локация:</span> {event.location || "Локация не указана"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Тип:</span> {typeTranslations[event.type]}
                                        </div>
                                        <div>
                                            <span className="font-medium">Организатор:</span> {event.createdBy || "Не указан"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose} color="primary">
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    );
};