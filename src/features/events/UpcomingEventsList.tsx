import React from "react";
import { Calendar, Clock, X } from "lucide-react";

interface Event {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  type?: string;
  address?: string;
  creator?: string;
  keywords?: string[];
}

interface Props {
  events: Event[];
  onSelect: (event: Event | null) => void;
  selectedEvent: Event | null;
  onEnroll: () => void;
}

const UpcomingEventsList: React.FC<Props> = ({ events, onSelect, selectedEvent, onEnroll }) => {
  return (
    <>
      <div className="flex flex-col gap-4 max-w-3xl">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onSelect(event)}
            className="cursor-pointer border rounded-xl border-blue-500 p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-700">{event.subtitle}</p>
            <p className="text-sm text-gray-500">{event.description}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600 items-center">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {event.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно с кнопкой */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-xl rounded-xl p-6 shadow-xl animate-fade-in relative">
            <button
              onClick={() => onSelect(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-1">Тип: {selectedEvent.type}</p>
            <p className="text-gray-700 mb-1">Описание: {selectedEvent.description}</p>
            <p className="text-gray-700 mb-1">Дата: {selectedEvent.date}</p>
            <p className="text-gray-700 mb-1">Время: {selectedEvent.time}</p>
            <p className="text-gray-700 mb-1">Адрес: {selectedEvent.address}</p>
            <p className="text-gray-700 mb-4">Организатор: {selectedEvent.creator}</p>

            {selectedEvent.keywords && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Ключевые слова:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              onClick={onEnroll}
            >
              Записаться на мероприятие
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingEventsList;
