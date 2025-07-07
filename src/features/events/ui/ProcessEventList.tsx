import React, { useEffect, useState } from "react";
import { Calendar, Clock, Edit, Trash } from "lucide-react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Spinner,
    Input,
    Textarea,
    Select,
    SelectItem,
} from "@heroui/react";
import {
    type ApiEvent,
    type ApiUser,
    fetchUserById,
    updateEvent,
    deleteEvent,
    type ApiUpdateEvent,
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
): { date: string; endDate?: string; time: string; endTime: string; localStartTime: string; localEndTime: string } => {
    const start = new Date(isoStart);
    const end = new Date(isoEnd);
    const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

    const date = start.toLocaleDateString("ru-RU", dateOptions);
    const endDate = end.toLocaleDateString("ru-RU", dateOptions);
    const time = start.toLocaleTimeString("ru-RU", timeOptions);
    const endTime = end.toLocaleTimeString("ru-RU", timeOptions);

    const localStartTime = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    const localEndTime = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    return date !== endDate
        ? { date, endDate, time, endTime, localStartTime, localEndTime }
        : { date, time, endTime, localStartTime, localEndTime };
};

const transformApiEvent = (apiEvent: ApiEvent): {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate: string | undefined;
    time: string;
    endTime: string;
    type: string;
    address: string | undefined;
    creator: string;
    keywords: string[];
    rawTimeStart: string;
    rawTimeEnd: string;
    localTimeStart: string;
    localTimeEnd: string
} => {
    const { date, endDate, time, endTime, localStartTime, localEndTime } = formatDateTime(apiEvent.timeStart, apiEvent.timeEnd);
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
        rawTimeStart: apiEvent.timeStart,
        rawTimeEnd: apiEvent.timeEnd,
        localTimeStart: localStartTime,
        localTimeEnd: localEndTime,
    };
};

const fetchEventsForPastList = async (options?: { signal?: AbortSignal }): Promise<ApiEvent[]> => {
    try {
        const response = await api.post<ApiEvent[]>('/Event/search', {}, { signal: options?.signal });
        console.log('API Call: POST /Event/search - Response:', response.data);

        if (Array.isArray(response.data)) {
            return response.data.filter(event => event.status === 'suggested');
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


const ProcessEventsList: React.FC<Props> = ({ onSelect, selectedEvent }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const { isOpen: isDeleteConfirmOpen, onOpen: onDeleteConfirmOpen, onClose: onDeleteConfirmClose } = useDisclosure();

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [organizer, setOrganizer] = useState<ApiUser | null>(null);
    const [orgError, setOrgError] = useState<string | null>(null);

    const [modalContentReady, setModalContentReady] = useState(false);

    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadEvents = async () => {
        setLoading(true);
        setError(null);
        const controller = new AbortController();

        try {
            const data = await fetchEventsForPastList({ signal: controller.signal });
            setEvents(data.map(transformApiEvent));
        } catch (err: unknown) {
            if (!axios.isCancel(err)) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Произошла ошибка при загрузке мероприятий.");
                }
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }

        return () => controller.abort();
    };


    useEffect(() => {
        loadEvents();
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
            setEditingEvent(null);
            onEditModalClose();
            onDeleteConfirmClose();
        }
    }, [selectedEvent, onOpen, onClose, onEditModalClose, onDeleteConfirmClose]);

    const handleClose = () => {
        onSelect(null);
        setEditingEvent(null);
        setEditFormErrors({});
    };

    const handleEditClick = () => {
        if (selectedEvent) {
            setEditingEvent({ ...selectedEvent });
            onEditModalOpen();
        }
    };

    const handleDeleteClick = () => {
        if (selectedEvent) {
            onDeleteConfirmOpen();
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingEvent(prev => prev ? { ...prev, [name]: value } : null);
        if (editFormErrors[name]) {
            setEditFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEditingEvent(prev => prev ? { ...prev, keywords: value.split(',').map(kw => kw.trim()).filter(kw => kw) } : null);
    };

    const validateEditForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!editingEvent?.title) errors.title = "Название обязательно.";
        if (!editingEvent?.description) errors.description = "Описание обязательно.";
        if (!editingEvent?.localTimeStart) errors.localTimeStart = "Дата и время начала обязательны.";
        if (!editingEvent?.localTimeEnd) errors.localTimeEnd = "Дата и время окончания обязательны.";
        if (editingEvent?.localTimeStart && editingEvent?.localTimeEnd && new Date(editingEvent.localTimeStart) >= new Date(editingEvent.localTimeEnd)) {
            errors.localTimeEnd = "Время окончания должно быть позже времени начала.";
        }
        setEditFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleUpdateSubmit = async () => {
        if (!editingEvent || !validateEditForm()) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        const timeStartUTC = new Date(editingEvent.localTimeStart!).toISOString();
        const timeEndUTC = new Date(editingEvent.localTimeEnd!).toISOString();

        const updateData: ApiUpdateEvent = {
            id: editingEvent.id,
            name: editingEvent.title,
            description: editingEvent.description,
            timeStart: timeStartUTC,
            timeEnd: timeEndUTC,
            type: editingEvent.type,
            location: editingEvent.address,
            keywords: editingEvent.keywords,
        };

        try {
            await updateEvent(editingEvent.id, updateData);
            await loadEvents();
            onEditModalClose();
            onSelect(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Не удалось обновить мероприятие.");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedEvent) return;

        setIsDeleting(true);
        setError(null);
        try {
            await deleteEvent(selectedEvent.id);
            await loadEvents();
            onDeleteConfirmClose();
            onSelect(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Не удалось удалить мероприятие.");
            }
        } finally {
            setIsDeleting(false);
        }
    };


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
                        ) : null}
                    </ModalBody>

                    <ModalFooter className="flex justify-between items-center">
                        {error && <p className="text-red-500 text-sm mr-auto">{error}</p>}
                        <div className="flex gap-2">
                            <Button onPress={handleEditClick} color="primary" variant="flat" startContent={<Edit size={16} />}>
                                Редактировать
                            </Button>
                            <Button onPress={handleDeleteClick} color="danger" variant="flat" startContent={<Trash size={16} />}>
                                Удалить
                            </Button>
                            <Button onPress={handleClose} color="primary" autoFocus>
                                Закрыть
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalClose} placement="center">
                <ModalContent className="w-full max-w-xl">
                    <ModalHeader>
                        <h2 className="text-2xl font-bold text-gray-800">Редактировать мероприятие</h2>
                    </ModalHeader>
                    <ModalBody className="p-4 space-y-4">
                        {editingEvent && (
                            <>
                                <Input
                                    label="Название мероприятия"
                                    name="title"
                                    value={editingEvent.title}
                                    onChange={handleEditInputChange}
                                    isInvalid={!!editFormErrors.title}
                                    errorMessage={editFormErrors.title}
                                />
                                <Textarea
                                    label="Описание"
                                    name="description"
                                    value={editingEvent.description || ''}
                                    onChange={handleEditInputChange}
                                    isInvalid={!!editFormErrors.description}
                                    errorMessage={editFormErrors.description}
                                />
                                <Input
                                    label="Дата и время начала"
                                    name="localTimeStart"
                                    type="datetime-local"
                                    value={editingEvent.localTimeStart}
                                    onChange={handleEditInputChange}
                                    isInvalid={!!editFormErrors.localTimeStart}
                                    errorMessage={editFormErrors.localTimeStart}
                                />
                                <Input
                                    label="Дата и время окончания"
                                    name="localTimeEnd"
                                    type="datetime-local"
                                    value={editingEvent.localTimeEnd}
                                    onChange={handleEditInputChange}
                                    isInvalid={!!editFormErrors.localTimeEnd}
                                    errorMessage={editFormErrors.localTimeEnd}
                                />
                                <Input
                                    label="Адрес"
                                    name="address"
                                    value={editingEvent.address || ''}
                                    onChange={handleEditInputChange}
                                />
                                <Select
                                    label="Тип мероприятия"
                                    name="type"
                                    selectedKeys={editingEvent.type ? [editingEvent.type.toLowerCase()] : []}
                                    onChange={handleEditInputChange}
                                >
                                    {Object.entries(eventTypeTranslations).map(([key, value]) => (
                                        <SelectItem key={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label="Ключевые слова (через запятую)"
                                    name="keywords"
                                    value={editingEvent.keywords.join(', ')}
                                    onChange={handleKeywordsChange}
                                />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter className="flex justify-end gap-2">
                        <Button variant="flat" onPress={onEditModalClose} isDisabled={isUpdating}>
                            Отмена
                        </Button>
                        <Button color="primary" onPress={handleUpdateSubmit} isDisabled={isUpdating}>
                            {isUpdating ? <Spinner size="sm" color="white" /> : "Сохранить изменения"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteConfirmOpen} onOpenChange={onDeleteConfirmClose} placement="center">
                <ModalContent>
                    <ModalHeader>Подтвердите удаление</ModalHeader>
                    <ModalBody>
                        <p>Вы уверены, что хотите удалить мероприятие "<strong>{selectedEvent?.title}</strong>"? Это действие необратимо.</p>
                    </ModalBody>
                    <ModalFooter className="flex justify-end gap-2">
                        <Button variant="flat" onPress={onDeleteConfirmClose} isDisabled={isDeleting}>
                            Отмена
                        </Button>
                        <Button color="danger" onPress={handleConfirmDelete} isDisabled={isDeleting}>
                            {isDeleting ? <Spinner size="sm" color="white" /> : "Удалить"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProcessEventsList;