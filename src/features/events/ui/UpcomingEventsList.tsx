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

import { fetchInvitedEvents, respondToInvitation } from "@features/events/api/eventApi"; // путь адаптируй
import type { ApiEvent } from "@features/events/api/eventApi";

const InvitedEventsList: React.FC = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const controller = new AbortController();
    fetchInvitedEvents({ signal: controller.signal })
        .then(setEvents)
        .catch(console.error)
        .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedEvent) onOpen();
    else onClose();
  }, [selectedEvent]);

  const handleModalClose = () => setSelectedEvent(null);

  const handleRespond = async (status: "approved" | "rejected") => {
    if (!selectedEvent) return;
    setIsResponding(true);
    try {
      await respondToInvitation(selectedEvent.id, status);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setSelectedEvent(null);
    } catch (err) {
      console.error("Ошибка при ответе на приглашение:", err);
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
        </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500">Нет приглашений на мероприятия.</p>;
  }

  return (
      <>
        <div className="flex flex-col gap-4 max-w-3xl">
          {events.map((event) => (
              <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer border rounded-xl border-blue-500 p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p className="text-sm text-gray-700">{event.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600 items-center">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(event.timeStart).toLocaleDateString()}
              </span>
                  <span className="flex items-center gap-1">
                <Clock size={16} />
                    {new Date(event.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
                </div>
              </div>
          ))}
        </div>

        <Modal isOpen={isOpen} onOpenChange={handleModalClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">{selectedEvent?.name}</h2>
            </ModalHeader>

            <ModalBody>
              {selectedEvent ? (
                  <div className="text-gray-700 space-y-1">
                    <p>Описание: {selectedEvent.description || "Нет описания"}</p>
                    <p>Дата: {new Date(selectedEvent.timeStart).toLocaleDateString()}</p>
                    <p>Время: {new Date(selectedEvent.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Место: {selectedEvent.location || "Не указано"}</p>
                    <p>Тип: {selectedEvent.type || "Не указан"}</p>
                    {selectedEvent.keywords?.length > 0 && (
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

            <ModalFooter className="flex-col gap-2 items-stretch">
              <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onPress={() => handleRespond("approved")}
                  isDisabled={isResponding}
              >
                {isResponding ? <Spinner size="sm" /> : "Принять приглашение"}
              </Button>
              <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onPress={() => handleRespond("rejected")}
                  isDisabled={isResponding}
              >
                {isResponding ? <Spinner size="sm" /> : "Отклонить приглашение"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
};

export default InvitedEventsList;
