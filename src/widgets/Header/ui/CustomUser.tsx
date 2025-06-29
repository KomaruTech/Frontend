import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    User,
    Avatar,
} from "@heroui/react";
import {useDispatch, useSelector} from 'react-redux';
import {Link} from "react-router-dom";
import { logout } from '@features/auth/model/authSlice.ts';
import type {RootState} from "@app/store";

export default function CustomUser() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const handleLogout = () => {
        dispatch(logout());
    };
    const avatarSrc = currentUser?.avatarUrl || "https://i.pravatar.cc/150?u=default_user_avatar";
    const userName = currentUser ? `${currentUser.name} ${currentUser.surname || ''}` : "Гость";
    const userEmail = currentUser?.email || "";
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
                        src={avatarSrc}
                    />
                </DropdownTrigger>

                <DropdownMenu
                    aria-label="User Menu"
                    className="p-3"
                    disabledKeys={["profile"]}
                    itemClasses={{
                        base: [
                            "rounded-md",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[hover=true]:bg-default-100",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    }}
                >
                    <DropdownSection showDivider aria-label="Profile & Actions">
                        <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
                            <User
                                avatarProps={{
                                    size: "sm",
                                    src: avatarSrc,
                                }}
                                classNames={{
                                    name: "text-default-600",
                                    description: "text-default-500",
                                }}
                                name={userName}
                                description={userEmail}
                            />
                        </DropdownItem>
                        <DropdownItem key="edit-my-profile">
                            <Link to="/profile/me/edit" className="block w-full h-full text-inherit no-underline">
                                Редактировать профиль
                            </Link>
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