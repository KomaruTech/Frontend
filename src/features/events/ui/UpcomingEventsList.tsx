import React, { useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

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

const UpcomingEventsList: React.FC<Props> = ({
                                               events,
                                               onSelect,
                                               selectedEvent,
                                               onEnroll,
                                             }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Ключевые слова:
                          </p>
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

            <ModalFooter className="flex-col gap-2 items-stretch">
              <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onPress={onEnroll}
              >
                Записаться на мероприятие
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
};

export default UpcomingEventsList;
