import React, { useState } from 'react';
import {
    Badge,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useDisclosure
} from "@heroui/react";
 import {NotificationIcon} from "@shared/ui/icons/NotificationIcon.tsx";

type NotificationItem = {
    id: string;
    title: string;
    description: string;
    read: boolean;
    timestamp: string; // ISO string for date/time
};
interface NotificationContentProps {
    onClose: () => void;
}
const NotificationContent: React.FC<NotificationContentProps> = ({ onClose }) => {
    // Example notification data, now managed within this content component
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: '1', title: 'Новое сообщение', description: 'Вам пришло новое сообщение от Администратора.', read: false, timestamp: '2025-06-29T10:00:00Z' },
        { id: '2', title: 'Обновление профиля', description: 'Ваш профиль был успешно обновлен.', read: true, timestamp: '2025-06-28T15:30:00Z' },
        { id: '3', title: 'Напоминание о событии', description: 'Сегодня в 17:00 встреча.', read: false, timestamp: '2025-06-29T09:00:00Z' },
        { id: '4', title: 'Новый комментарий', description: 'Пользователь оставил комментарий к вашей публикации.', read: false, timestamp: '2025-06-29T08:00:00Z' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="p-4 w-80 bg-white shadow-lg border border-gray-200 rounded-lg"> {/* This div now acts as the PopoverContent */}
            {/* Header */}
            <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Уведомления</h3>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-500">
                        Непрочитанных: {unreadCount}
                    </p>
                )}
            </div>

            {/* Body - Notification list */}
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 rounded-lg flex flex-col transition-colors duration-200 ${
                                    notification.read ? 'bg-gray-50 text-gray-600' : 'bg-blue-50 text-gray-900 font-semibold'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-base">{notification.title}</h4>
                                    {!notification.read && (
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            onPress={() => markAsRead(notification.id)}
                                            className="ml-auto text-xs px-2 py-1"
                                        >
                                            Прочитать
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm">{notification.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.timestamp).toLocaleString('ru-RU', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Уведомлений пока нет.</p>
                )}
            </div>

            {/* Footer - Actions */}
            <div className="flex justify-end gap-2 mt-4">
                {unreadCount > 0 && (
                    <Button color="primary" variant="flat" onPress={markAllAsRead} className="mr-auto">
                        Прочитать все
                    </Button>
                )}
                <Button color="danger" variant="light" onPress={onClose}> {/* Use onClose from props */}
                    Закрыть
                </Button>
            </div>
        </div>
    );
};
// --- End NotificationContent Component ---


// Main Notification Component (now simpler, acting as the Popover host)
export default function Notification() {
    // Деструктурируем onClose из useDisclosure
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    // We still need unreadCount for the Badge, so calculate it here
    // In a real app, this might come from a global state or a dedicated hook
    const mockNotificationsForBadge = [ // Simplified mock for badge calculation
        { id: '1', read: false }, { id: '2', read: true }, { id: '3', read: false }, { id: '4', read: false },
    ];
    const unreadCount = mockNotificationsForBadge.filter(n => !n.read).length;


    return (
        <>
            <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={onOpenChange}>
                <PopoverTrigger>
                    <Badge
                        color="danger"
                        content={unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount.toString()) : ''}
                        shape="circle"
                    >
                        <Button isIconOnly aria-label="уведомления" radius="full" variant="light" onPress={onOpen}>
                            <NotificationIcon size={24} />
                        </Button>
                    </Badge>
                </PopoverTrigger>
                {/* NotificationContent is now the child of PopoverContent */}
                <PopoverContent className="p-0">
                    {/* Передаем явную функцию onClose из useDisclosure */}
                    <NotificationContent onClose={onClose} />
                </PopoverContent>
            </Popover>
        </>
    );
}