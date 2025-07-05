import React, { useEffect, useState, useCallback } from "react";
import {
    Spinner,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { Calendar, Clock, MapPinned, User } from "lucide-react";
import {
    fetchEventsModeration,
    confirmEvent,
    rejectEvent,
    getUserById,
    type ApiUser,
} from "@features/applications/api/applicationApi";
import type { ApiEvent } from "@features/events/api/eventApi";

export const EventModerationList: React.FC = () => {
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEvents = useCallback(() => {
        setLoading(true);
        fetchEventsModeration()
            .then((data) => {
                setEvents(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Ошибка загрузки мероприятий:", err);
                setError(err instanceof Error ? err.message : "Не удалось загрузить мероприятия.");
                addToast({
                    title: "Ошибка",
                    description: "Не удалось загрузить мероприятия. Попробуйте снова.",
                    color: "danger",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Spinner label="Загрузка мероприятий..." size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-600 text-lg font-medium">Ошибка: {error}</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500 text-lg">Нет предложенных мероприятий для модерации.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
            {events.map((event) => (
                <EventCard key={event.id} event={event} onEventAction={loadEvents} />
            ))}
        </div>
    );
};

interface EventCardProps {
    event: ApiEvent;
    onEventAction: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEventAction }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [creator, setCreator] = useState<ApiUser | null>(null);
    const [cardLoading, setCardLoading] = useState(true); // New state for overall card loading
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    useEffect(() => {
        // Set cardLoading to true when starting to fetch creator data
        setCardLoading(true);
        getUserById(event.createdById)
            .then(setCreator)
            .catch((err) => {
                console.error("Ошибка получения пользователя:", err);
                addToast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные создателя мероприятия.",
                    color: "warning",
                });
                setCreator(null); // Ensure creator is null on error
            })
            .finally(() => setCardLoading(false)); // Set cardLoading to false when fetching is complete
    }, [event.createdById]);

    const handleAction = async (action: "confirm" | "reject") => {
        try {
            onOpenChange();
            if (action === "confirm") {
                setConfirmLoading(true);
                await confirmEvent(event.id);
                await onEventAction();
                addToast({
                    title: "Успешно",
                    description: "Мероприятие успешно подтверждено!",
                    color: "success",
                });
            } else {
                setRejectLoading(true);
                await rejectEvent(event.id);
                await onEventAction();
                addToast({
                    title: "Успешно",
                    description: "Мероприятие отклонено.",
                    color: "danger",
                });
            }
        } catch (err) {
            console.error("Ошибка действия:", err);
            addToast({
                title: "Ошибка",
                description: "Произошла ошибка. Попробуйте снова.",
                color: "warning",
            });
        } finally {
            setConfirmLoading(false);
            setRejectLoading(false);
        }
    };

    const formattedStartDate = new Date(event.timeStart).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedStartTime = new Date(event.timeStart).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const formattedEndTime = new Date(event.timeEnd).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <>
            <Card className="max-w-full md:max-w-2xl lg:max-w-3xl transition-shadow duration-300 ease-in-out transform rounded-lg border border-gray-200 relative">
                {cardLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
                        <Spinner label="Загрузка данных карточки..." size="md" />
                    </div>
                )}
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col flex-grow min-w-0">
                        <p className="text-xl font-bold text-gray-900 truncate">{event.name}</p>
                        {/* Creator information will be hidden by the spinner when loading */}
                        {!cardLoading && (
                            creator ? (
                                <p className="text-sm text-default-500 truncate">
                                    Создатель: {creator.name} {creator.surname}
                                </p>
                            ) : (
                                <p className="text-sm text-red-500 truncate">Создатель неизвестен</p>
                            )
                        )}
                    </div>
                </CardHeader>

                <Divider />

                <CardBody className="py-3 px-5">
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-blue-500 flex-shrink-0" />
                            <span className="break-words break-all w-full">
                                <strong className="text-gray-800">Дата:</strong> {formattedStartDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-green-500 flex-shrink-0" />
                            <span className="break-words break-all w-full">
                                <strong className="text-gray-800">Время:</strong> {formattedStartTime} - {formattedEndTime}
                            </span>
                        </div>
                    </div>
                </CardBody>

                <Divider />

                <CardFooter className="flex justify-end pt-3">
                    <Button onPress={onOpen} color="primary" className="px-6 py-2" isDisabled={cardLoading}>
                        Посмотреть детали
                    </Button>
                </CardFooter>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-200">
                        <p className="truncate">{event.name}</p>
                    </ModalHeader>
                    <ModalBody className="py-6 px-5 text-gray-700">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600 flex-shrink-0" />
                            <strong className="flex-shrink-0">Дата:</strong>
                            <span className="break-words break-all w-full">
                                {formattedStartDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-green-600 flex-shrink-0" />
                            <strong className="flex-shrink-0">Время:</strong>
                            <span className="break-words break-all w-full">
                                {formattedStartTime} - {formattedEndTime}
                            </span>
                        </div>
                        {event.location && (
                            <div className="flex gap-2">
                                <MapPinned size={20} className="text-red-600 flex-shrink-0" />
                                <strong className="flex-shrink-0">Местоположение:</strong>
                                <span className="break-words break-all w-full">
                                    {event.location}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <User size={20} className="text-purple-600 flex-shrink-0" />
                            <strong className="flex-shrink-0">Создатель:</strong>{" "}
                            <span className="break-words break-all w-full">
                                {cardLoading ? ( // Use cardLoading here as well for consistency
                                    <Spinner size="sm" />
                                ) : creator ? (
                                    `${creator.name} ${creator.surname}`
                                ) : (
                                    <span className="text-red-500">Неизвестно</span>
                                )}
                            </span>
                        </div>
                        <div className="pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Описание:</h4>
                            <p className="text-base leading-relaxed break-words break-all">
                                {event.description}
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button variant="light" onPress={onOpenChange}>
                            Отмена
                        </Button>
                        <Button
                            color="danger"
                            onPress={() => handleAction("reject")}
                            isLoading={rejectLoading}
                            className="px-6"
                        >
                            Отклонить
                        </Button>
                        <Button
                            color="success"
                            onPress={() => handleAction("confirm")}
                            isLoading={confirmLoading}
                            className="px-6"
                        >
                            Подтвердить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};