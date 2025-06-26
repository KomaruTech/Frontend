import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

type CalendarEvent = {
  title: string;
  color: string; // RGB строка, например: "rgb(255,107,53)"
  time?: string;
  speaker?: string;
};

function CustomCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  let firstDayIndex = new Date(year, month, 1).getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const events: Record<number, CalendarEvent[]> = {
    3: [{ title: "One on One", color: "rgb(255,107,53)", time: "11:00", speaker: "Мария К." }],
    7: [{ title: "Митап", color: "rgb(0,48,73)", time: "15:30", speaker: "Алексей П." }],
    12: [
      { title: "Тимбилдинг", color: "rgb(168,8,31)", time: "10:00", speaker: "HR-команда" },
      { title: "Митап", color: "rgb(0,48,73)", time: "16:00" },
    ],
    18: [{ title: "Встреча", color: "rgb(0,112,244)", time: "17:00" }],
  };

  const calendarCells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(
      <div key={`empty-${i}`} className="p-4 bg-transparent border-0" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate();
    const dayEvents = events[day] || [];

    calendarCells.push(
      <div
        key={day}
        onClick={() => {
          setSelectedDay(day);
          onOpen();
        }}
        className="w-10 h-16 flex flex-col items-center justify-start mx-auto cursor-pointer"
      >
        <div
          className={`text-[rgb(0,78,158)] border border-[rgb(0,78,158)] w-10 h-10 flex items-center justify-center hover:bg-[rgb(227,195,157)] font-involve text-sm rounded-full transition-colors duration-150 ${
            isToday
              ? "bg-blue-200 font-bold text-[rgb(0,78,158)]"
              : "bg-[rgb(247,225,198)]"
          }`}
        >
          {day}
        </div>

        {/* События — кружки под датой */}
        <div className="mt-1 flex gap-1 flex-wrap justify-center">
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: event.color }}
              title={event.title}
            />
          ))}
        </div>
      </div>
    );
  }

  const selectedEvents = selectedDay ? events[selectedDay] || [] : [];

  return (
    <>
      <div className="flex">
        {/* Календарь слева */}
        <div className="flex-1 max-w-[750px]">
          {/* Заголовки дней недели */}
          <div className="grid grid-cols-7 text-center text-[rgb(0,78,158)] font-involve font-medium mb-2">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Сетка дней */}
          <div className="grid grid-cols-7 gap-y-5">{calendarCells}</div>
        </div>
      </div>

      {/* Модальное окно */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-involve text-[rgb(0,78,158)]">
                События на {selectedDay} июня
              </ModalHeader>
              <ModalBody className="font-involve space-y-3">
                {selectedEvents.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-800">
                    {selectedEvents.map((e, idx) => (
                      <li key={idx} className="border-b pb-2">
                        <div className="flex items-center gap-2 font-semibold">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: e.color }}
                          />
                          {e.title}
                        </div>
                        {e.time && (
                          <div>
                            <span className="font-medium text-[rgb(0,78,158)]">Время: </span>
                            {e.time}
                          </div>
                        )}
                        {e.speaker && (
                          <div>
                            <span className="font-medium text-[rgb(0,78,158)]">Спикер: </span>
                            {e.speaker}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Событий нет</p>
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
    </>
  );
}

export default CustomCalendar;
