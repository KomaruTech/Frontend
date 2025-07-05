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
import {
  fetchEvents,
  type ApiEvent,
  type ApiUser,
  fetchUserById,
} from "@features/events/api/eventApi";
import axios from 'axios';
import type { Event } from "@entities/event";

interface Props {
  onSelect: (event: Event | null) => void;
  selectedEvent: Event | null;
}

const eventTypeTranslations: Record<string, string> = {
  personal: "Личный",
  group: "Групповой",
  general: "Общий",
};

const formatDateTime = (
    isoStart: string,
    isoEnd: string
): { date: string; endDate?: string; time: string; endTime: string } => {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const date = start.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
  const endDate = end.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
  const time = start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return date !== endDate
      ? { date, endDate, time, endTime }
      : { date, time, endTime };
};

const transformApiEvent = (apiEvent: ApiEvent): Event => {
  const { date, endDate, time, endTime } = formatDateTime(apiEvent.timeStart, apiEvent.timeEnd);
  return {
    id: apiEvent.id,
    title: apiEvent.name,
    description: apiEvent.description,
    date,
    endDate,
    time,
    endTime,
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

  const [organizer, setOrganizer] = useState<ApiUser | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchEvents({ signal: controller.signal })
        .then(data => setEvents(data.map(transformApiEvent)))
        .catch(err => { if (!axios.isCancel(err)) setError(err.message); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (selectedEvent) onOpen();
    else onClose();
  }, [selectedEvent, onOpen, onClose]);

  useEffect(() => {
    if (!selectedEvent?.creator) return;
    const controller = new AbortController();
    setOrgLoading(true);
    setOrgError(null);
    fetchUserById(selectedEvent.creator, { signal: controller.signal })
        .then(user => setOrganizer(user))
        .catch(err => { if (!axios.isCancel(err)) setOrgError(err.message); })
        .finally(() => { if (!controller.signal.aborted) setOrgLoading(false); });
    return () => controller.abort();
  }, [selectedEvent]);

  const handleClose = () => {
    onSelect(null);
    onClose();
  };

  if (loading) return <Spinner size="lg" label="Загрузка мероприятий..." />;
  if (error) return <div className="text-red-500 text-center py-8">Ошибка: {error}</div>;
  if (events.length === 0) return <div className="text-gray-600 text-center py-8">Мероприятия не найдены.</div>;

  return (
      <>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto p-4">
          {events.map(evt => (
              <div
                  key={evt.id}
                  onClick={() => onSelect(evt)}
                  className="cursor-pointer border rounded-xl border-blue-500 p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <h2 className="text-lg font-semibold text-blue-800">{evt.title}</h2>
                <p className="text-sm text-gray-700 line-clamp-2 mt-1">{evt.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-600 items-center">
                  <span className="flex items-center gap-1"><Calendar size={16} />{evt.date}</span>
                  <span className="flex items-center gap-1"><Clock size={16} />{evt.time} – {evt.endTime}</span>
                </div>
                {evt.type && (
                    <span className="inline-block mt-2 bg-blue-50 text-blue-500 text-xs px-2.5 py-0.5 rounded-full">
                {eventTypeTranslations[evt.type.toLowerCase()] || evt.type}
              </span>
                )}
              </div>
          ))}
        </div>

        <Modal isOpen={isOpen} onOpenChange={handleClose}>
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-blue-800">{selectedEvent?.title}</h2>
            </ModalHeader>
            {/* Добавлена обёртка с переносом строк */}
            <ModalBody className="overflow-hidden whitespace-pre-wrap break-words">
              {selectedEvent && (
                  <div className="space-y-2 text-gray-700">
                    <p className="break-words">
                      <strong>Тип:</strong> {selectedEvent.type ? (eventTypeTranslations[selectedEvent.type.toLowerCase()] || selectedEvent.type) : "Не указан"}
                    </p>
                    <p className="break-words">
                      <strong>Описание:</strong> {selectedEvent.description || "Нет описания"}
                    </p>
                    <p className="break-words">
                      <strong>Дата:</strong> {selectedEvent.date}{selectedEvent.endDate ? ` – ${selectedEvent.endDate}` : ''}
                    </p>
                    <p className="break-words">
                      <strong>Время:</strong> {selectedEvent.time} – {selectedEvent.endTime}
                    </p>
                    <p className="break-words">
                      <strong>Адрес:</strong> {selectedEvent.address || "Не указан"}
                    </p>
                    {/* Здесь заменяем <p> на <div> */}
                    <div className="break-words">
                      <strong>Организатор:</strong>{' '}
                      {orgLoading ? <Spinner size="sm" /> : orgError ? `Ошибка: ${orgError}` : organizer ? `${organizer.name} ${organizer.surname}` : selectedEvent.creator}
                    </div>
                    {selectedEvent.keywords?.length && (
                        <div>
                          <p className="font-medium text-gray-700 break-words">Ключевые слова:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedEvent.keywords!.map((kw, i) => (
                                <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                {kw}
              </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onPress={handleClose} color="primary" autoFocus>Закрыть</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
};

export default PastEventsList;
