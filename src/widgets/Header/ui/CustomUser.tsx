import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    User,
    Avatar,
} from "@heroui/react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '@features/auth/model/authSlice.ts';
import type { RootState } from "@app/store";
import { useState, useEffect } from "react"; // <-- Импортируем хуки

// Импортируем нашу API-функцию для загрузки аватара
import { fetchMyAvatar } from "@features/profile/api/profileApi.ts";

export default function CustomUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    // Локальное состояние для хранения временного URL аватара
    const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);

    // useEffect для загрузки аватара при изменении пользователя или его аватара
    useEffect(() => {
        let objectUrl: string | null = null;

        const loadAvatar = async () => {
            // Загружаем, только если у пользователя есть ссылка на аватар
            if (currentUser?.avatarUrl) {
                try {
                    const blob = await fetchMyAvatar(currentUser.avatarUrl);
                    objectUrl = URL.createObjectURL(blob);
                    setAvatarObjectUrl(objectUrl);
                } catch (error) {
                    console.error("Не удалось загрузить аватар для CustomUser:", error);
                    setAvatarObjectUrl(null);
                }
            } else {
                // Если у пользователя нет аватара, сбрасываем состояние
                setAvatarObjectUrl(null);
            }
        };

        loadAvatar();

        // Функция очистки для предотвращения утечек памяти
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [currentUser?.avatarUrl]); // Зависимость от URL аватара в Redux

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleEditProfile = () => {
        navigate("/profile/me/edit");
    };

    const userName = currentUser ? `${currentUser.name || ''} ${currentUser.surname || ''}`.trim() : "Гость";
    const userEmail = currentUser?.email || "";

    // Используем наш локальный URL. Если его нет, `src` будет `undefined`, и компонент Avatar покажет fallback.
    const finalAvatarSrc = avatarObjectUrl || undefined;

    return (
        <div className="flex items-center gap-4">
            <Dropdown showArrow placement="bottom-end" radius="sm"
                      classNames={{
                          base: "before:bg-default-200",
                          content: "p-0 border-small border-divider bg-background",
                      }}
            >
                <DropdownTrigger>
                    <Avatar
                        as="button"
                        className="transition-transform"
                        src={finalAvatarSrc} // <-- ИЗМЕНЕНИЕ №1
                    />
                </DropdownTrigger>

                <DropdownMenu
                    aria-label="User Menu"
                    className="p-3"
                    disabledKeys={["profile"]}
                    itemClasses={{
                        base: [
                            "rounded-md", "text-default-500", "transition-opacity",
                            "data-[hover=true]:text-foreground", "data-[hover=true]:bg-default-100",
                            "dark:data-[hover=true]:bg-default-50", "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-70", "data-[focus-visible=true]:ring-default-500",
                        ],
                    }}
                >
                    <DropdownSection showDivider aria-label="Profile & Actions">
                        <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
                            <User
                                avatarProps={{
                                    size: "sm",
                                    src: finalAvatarSrc, // <-- ИЗМЕНЕНИЕ №2
                                }}
                                classNames={{
                                    name: "text-default-600",
                                    description: "text-default-500",
                                }}
                                name={userName}
                                description={userEmail}
                            />
                        </DropdownItem>
                        <DropdownItem key="edit-my-profile" onPress={handleEditProfile}>
                            Редактировать профиль
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection aria-label="Help & Feedback">
                        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                            Выйти
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}