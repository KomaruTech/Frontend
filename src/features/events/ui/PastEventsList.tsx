import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { fetchEvents } from "@features/events/api/eventApi";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // Форматированная дата
  time: string; // Форматированное время
  type?: string;
  address?: string;
  creator?: string;
  keywords?: string[];
}

interface Props {
  onSelect: (event: Event | null) => void;
  selectedEvent: Event | null;
}

// Форматирует дату и время
const formatDateTime = (isoString: string): { date: string; time: string } => {
  const dateObj = new Date(isoString);
  return {
    date: dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: dateObj.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

// Преобразует событие с API
const transformApiEvent = (apiEvent: any): Event => {
  const { date, time } = formatDateTime(apiEvent.timeStart);
  return {
    id: apiEvent.id,
    title: apiEvent.name,
    description: apiEvent.description,
    date,
    time,
    type: apiEvent.type,
    address: apiEvent.location,
    creator: apiEvent.createdById,
    keywords: apiEvent.keywords,
  };
};

const PastEventsList: React.FC<Props> = ({ onSelect, selectedEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents();
        const transformed = data.map(transformApiEvent);
        setEvents(transformed);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      onOpen();
    } else {
      onClose();
    }
  }, [selectedEvent, onOpen, onClose]);

  const handleModalClose = () => {
    onClose();
    onSelect(null);
  };

  if (loading) {
    return <Spinner size="lg" label="Загрузка мероприятий..." />;
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

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
                <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
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

        <Modal isOpen={isOpen} onOpenChange={handleModalClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">{selectedEvent?.title}</h2>
            </ModalHeader>
            <ModalBody>
              {selectedEvent ? (
                  <div className="text-gray-700 space-y-1">
                    <p>Тип: {selectedEvent.type || "Не указан"}</p>
                    <p>Описание: {selectedEvent.description || "Нет описания"}</p>
                    <p>Дата: {selectedEvent.date}</p>
                    <p>Время: {selectedEvent.time}</p>
                    <p>Адрес: {selectedEvent.address || "Не указан"}</p>
                    <p>Организатор: {selectedEvent.creator || "Не указан"}</p>
                    {selectedEvent.keywords && selectedEvent.keywords.length > 0 && (
                        <div className="pt-2">
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
                  </div>
              ) : (
                  <div>Загрузка информации о событии...</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onPress={handleModalClose} color="primary" autoFocus>
                Закрыть
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
};

export default PastEventsList;
