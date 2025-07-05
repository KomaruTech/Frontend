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
  type ApiEvent,
  type ApiUser,
  fetchUserById,
} from "@features/events/api/eventApi";
import axios from 'axios';
import type { Event } from "@entities/event";
import api from '@shared/api';

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
  const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

  const date = start.toLocaleDateString("ru-RU", dateOptions);
  const endDate = end.toLocaleDateString("ru-RU", dateOptions);
  const time = start.toLocaleTimeString("ru-RU", timeOptions);
  const endTime = end.toLocaleTimeString("ru-RU", timeOptions);

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

const fetchEventsForPastList = async (options?: { signal?: AbortSignal }): Promise<ApiEvent[]> => {
  try {
    const response = await api.post<ApiEvent[]>('/Event/search', {}, { signal: options?.signal });
    console.log('API Call: POST /Event/search - Response:', response.data);

    if (Array.isArray(response.data)) {
      // Filter for 'confirmed' events, assuming this is desired for "past" list
      return response.data.filter(event => event.status === 'confirmed');
    } else if (response.status === 204) {
      console.warn('API Call: POST /Event/search - Received 204 No Content, returning empty array.');
      return [];
    } else {
      console.warn('API Call: POST /Event/search - Received non-array data:', response.data);
      return [];
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('API Call: POST /Event/search - Request was cancelled:', error.message);
      throw error;
    }
    const msg = (error instanceof Error) ? error.message : 'Неизвестная ошибка при загрузке событий';
    console.error('API Call: POST /Event/search - Error:', error);
    throw new Error(msg);
  }
};


const PastEventsList: React.FC<Props> = ({ onSelect, selectedEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [organizer, setOrganizer] = useState<ApiUser | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);

  const [modalContentReady, setModalContentReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchEventsForPastList({ signal: controller.signal })
        .then(data => setEvents(data.map(transformApiEvent)))
        .catch(err => { if (!axios.isCancel(err)) setError(err.message); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setModalContentReady(false);
      onOpen();

      if (selectedEvent.creator) {
        const controller = new AbortController();
        setOrgError(null);
        setOrganizer(null);

        fetchUserById(selectedEvent.creator, { signal: controller.signal })
            .then(user => {
              setOrganizer(user);
              setModalContentReady(true);
            })
            .catch(err => {
              if (!axios.isCancel(err)) setOrgError(err.message);
              setModalContentReady(true);
            });
        return () => controller.abort();
      } else {
        setOrganizer(null);
        setOrgError(null);
        setModalContentReady(true);
      }
    } else {
      onClose();
      setModalContentReady(false);
      setOrganizer(null);
      setOrgError(null);
    }
  }, [selectedEvent, onOpen, onClose]);

  const handleClose = () => {
    onSelect(null);
  };

  // Изменения здесь: Спиннер для загрузки ВСЕХ мероприятий
  if (loading) {
    return (
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-100px)] py-8"> {/* Adjusted height for better centering */}
          <Spinner size="lg" label="Загрузка мероприятий..." />
        </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-8">Ошибка загрузки: {error}</div>;
  if (events.length === 0) return <div className="text-gray-600 text-center py-8">Мероприятия не найдены.</div>;

  return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {events.map(evt => (
              <div
                  key={evt.id}
                  onClick={() => onSelect(evt)}
                  className="cursor-pointer border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 ease-in-out bg-white"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                  {evt.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{evt.description || "Описание отсутствует."}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 items-center mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-gray-400" />
                    {evt.date}
                    {evt.endDate && ` – ${evt.endDate}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-400" />
                    {evt.time} – {evt.endTime}
                  </span>
                </div>

                {evt.type && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {eventTypeTranslations[evt.type.toLowerCase()] || evt.type}
                    </span>
                )}
              </div>
          ))}
        </div>
        <Modal isOpen={isOpen} onOpenChange={handleClose}>
          <ModalContent className="w-full max-w-xl">
            <ModalHeader>
              <h2 className="text-2xl font-bold text-gray-800 break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                {selectedEvent?.title}
              </h2>
            </ModalHeader>

            <ModalBody className="p-4 flex justify-center items-center min-h-[200px]">
              {!modalContentReady && selectedEvent ? (
                  <Spinner size="lg" label="Загрузка данных карточки..." />
              ) : selectedEvent ? (
                  <div className="space-y-3 text-gray-700 text-base w-full">
                    <p className="break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <strong>Тип:</strong>{" "}
                      {selectedEvent.type
                          ? eventTypeTranslations[selectedEvent.type.toLowerCase()] || selectedEvent.type
                          : "Не указан"}
                    </p>

                    <p className="break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <strong>Описание:</strong> {selectedEvent.description || "Нет описания"}
                    </p>

                    <p className="break-words whitespace-pre-wrap">
                      <strong>Дата:</strong> {selectedEvent.date}
                      {selectedEvent.endDate ? ` – ${selectedEvent.endDate}` : ''}
                    </p>

                    <p className="break-words whitespace-pre-wrap">
                      <strong>Время:</strong> {selectedEvent.time} – {selectedEvent.endTime}
                    </p>

                    <p className="break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <strong>Адрес:</strong> {selectedEvent.address || "Не указан"}
                    </p>

                    <div className="break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <strong>Организатор:</strong>{" "}
                      {orgError ? (
                          <span className="text-red-500">Ошибка: {orgError}</span>
                      ) : organizer ? (
                          `${organizer.name} ${organizer.surname}`
                      ) : (
                          selectedEvent.creator ? `ID: ${selectedEvent.creator}` : 'Неизвестен'
                      )}
                    </div>

                    {selectedEvent.keywords && selectedEvent.keywords.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Ключевые слова:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.keywords.map((kw, i) => (
                                <span key={i} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-200" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {kw}
                  </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
              ) : null }
            </ModalBody>

            <ModalFooter>
              <Button onPress={handleClose} color="primary" autoFocus>
                Закрыть
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
};

export default PastEventsList;