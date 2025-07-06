import { useState, useEffect, useRef } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    addToast,
    Chip,
    Spinner,
    Input,
} from "@heroui/react";
import { Trash2, UserPlus, X } from "lucide-react";
import axios from "axios";
import {
    type ApiTeam,
    deleteTeam,
    removeTeamMember,
    addTeamMember,
} from "@features/createTeam/api/createTeamApi";
import { searchUsers, type UserSearchResponse } from "@features/post-event/api/postEventApi";

import { fetchUserById, type ApiUser } from "@features/events/api/eventApi";

interface TeamCardProps {
    team: ApiTeam;
    onTeamDeleted: (teamId: string) => void;
    onTeamUpdated: (updatedTeam: ApiTeam) => void;
    currentUserId: string;
    currentUserRole: string;
}

export default function TeamCard({
                                     team: initialTeam,
                                     onTeamDeleted,
                                     onTeamUpdated,
                                     currentUserId,
                                     currentUserRole,
                                 }: TeamCardProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddUserModalOpen, onOpen: onOpenAddUserModal, onClose: onCloseAddUserModal } = useDisclosure();

    const [team, setTeam] = useState<ApiTeam>(initialTeam);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);

    const [participantQuery, setParticipantQuery] = useState("");
    const [debouncedParticipantQuery, setDebouncedParticipantQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState<UserSearchResponse[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const searchTimer = useRef<NodeJS.Timeout | null>(null);

    // НОВОЕ СОСТОЯНИЕ ДЛЯ ИНФОРМАЦИИ О ВЛАДЕЛЬЦЕ
    const [ownerInfo, setOwnerInfo] = useState<ApiUser | null>(null);
    const [loadingOwnerInfo, setLoadingOwnerInfo] = useState(false);
    const [ownerInfoError, setOwnerInfoError] = useState<string | null>(null);

    useEffect(() => {
        setTeam(initialTeam);
        console.log("TeamCard: Initializing with team ID:", initialTeam.id);
        console.log("TeamCard: Owner ID:", initialTeam.ownerId);
        console.log("TeamCard: Current User ID:", currentUserId);
        console.log("TeamCard: Current User Role:", currentUserRole);
        const isOwner = currentUserId === initialTeam.ownerId;
        const isAdmin = currentUserRole === "administrator";
        const canManage = isOwner || isAdmin;
        console.log("TeamCard: Is owner?", isOwner);
        console.log("TeamCard: Is admin?", isAdmin);
        console.log("TeamCard: Can manage team (owner or admin)?", canManage);

        const fetchOwnerDetails = async () => {
            if (!initialTeam.ownerId) {
                setOwnerInfo(null);
                return;
            }
            setLoadingOwnerInfo(true);
            setOwnerInfoError(null);
            try {
                const user = await fetchUserById(initialTeam.ownerId); // Вызов API
                setOwnerInfo(user);
            } catch (error) {
                console.error("Failed to fetch owner details:", error);
                setOwnerInfoError("Не удалось загрузить информацию о владельце.");
            } finally {
                setLoadingOwnerInfo(false);
            }
        };

        fetchOwnerDetails();
    }, [initialTeam, currentUserId, currentUserRole]); // Добавляем initialTeam в зависимости для повторного запроса владельца

    // Debounce input for user search
    const onParticipantQueryChange = (value: string) => {
        setParticipantQuery(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setDebouncedParticipantQuery(value);
        }, 400);
    };

    useEffect(() => {
        if (debouncedParticipantQuery.length >= 2) {
            setLoadingUsers(true);
            searchUsers(debouncedParticipantQuery)
                .then((res) => {
                    if (Array.isArray(res)) {
                        setFoundUsers(res);
                    } else if (
                        res &&
                        typeof res === "object" &&
                        "data" in res &&
                        Array.isArray((res as { data?: unknown }).data)
                    ) {
                        setFoundUsers((res as { data: UserSearchResponse[] }).data);
                    } else {
                        setFoundUsers([]);
                        console.warn("Invalid format from searchUsers API:", res);
                    }
                })
                .catch((err) => {
                    console.error("Error during user search:", err);
                    setFoundUsers([]);
                })
                .finally(() => setLoadingUsers(false));
        } else {
            setFoundUsers([]);
        }
    }, [debouncedParticipantQuery]);

    const handleDeleteTeam = async () => {
        setIsDeleting(true);
        try {
            console.log("TeamCard: Attempting to delete team ID:", team.id);
            await deleteTeam(team.id);
            addToast({ title: "Успешно", description: `Команда "${team.name}" удалена.`, color: "success" });
            onClose();
            onTeamDeleted(team.id);
        } catch (error) {
            let msg = "Ошибка при удалении команды.";
            if (axios.isAxiosError(error) && error.response?.data?.message) msg = error.response.data.message;
            else if (error instanceof Error) msg = error.message;
            addToast({ title: "Ошибка", description: msg, color: "danger" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        setIsRemovingMember(true);
        try {
            console.log("TeamCard: Attempting to remove member ID:", userId, "from team ID:", team.id);
            const updatedTeam = await removeTeamMember(team.id, userId);
            setTeam(updatedTeam);
            onTeamUpdated(updatedTeam);
            addToast({ title: "Успешно", description: `Участник удалён из команды "${team.name}".`, color: "success" });
        } catch (error) {
            let msg = "Ошибка при удалении участника.";
            if (axios.isAxiosError(error) && error.response?.data?.message) msg = error.response.data.message;
            else if (error instanceof Error) msg = error.message;
            addToast({ title: "Ошибка", description: msg, color: "danger" });
        } finally {
            setIsRemovingMember(false);
        }
    };

    const handleAddMember = async (user: UserSearchResponse) => {
        setIsAddingMember(true);
        try {
            console.log("TeamCard: Attempting to add member ID:", user.id, "to team ID:", team.id);
            const updatedTeam = await addTeamMember(team.id, user.id);
            setTeam(updatedTeam);
            onTeamUpdated(updatedTeam);
            addToast({ title: "Успешно", description: `Участник ${user.name} добавлен в команду "${team.name}".`, color: "success" });
            setParticipantQuery("");
            setDebouncedParticipantQuery("");
            setFoundUsers([]);
            onCloseAddUserModal();
        } catch (error) {
            let msg = "Ошибка при добавлении участника.";
            if (axios.isAxiosError(error) && error.response?.data?.message) msg = error.response.data.message;
            else if (error instanceof Error) msg = error.message;
            addToast({ title: "Ошибка", description: msg, color: "danger" });
        } finally {
            setIsAddingMember(false);
        }
    };

    const canManageTeam = currentUserId === team.ownerId || currentUserRole === "admin";
    const isMember = (userId: string) => team.users.some((m) => m.id === userId);

    return (
        <>
            <div
                onClick={onOpen}
                className="cursor-pointer border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 ease-in-out bg-white"
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{team.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{team.description || "Без описания."}</p>
                <div className="mt-2 text-xs text-gray-500">Участников: {team.users.length}</div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalContent>
                    <ModalHeader>Детали команды: {team.name}</ModalHeader>
                    <ModalBody className="flex flex-col gap-4">
                        <p><strong>Название:</strong> {team.name}</p>
                        <p><strong>Описание:</strong> {team.description || "Без описания"}</p>
                        {/* ИЗМЕНЕННОЕ ОТОБРАЖЕНИЕ ВЛАДЕЛЬЦА */}
                        <p>
                            <strong>Владелец: </strong>
                            {loadingOwnerInfo ? (
                                <Spinner size="sm" />
                            ) : ownerInfoError ? (
                                <span className="text-red-500">{ownerInfoError}</span>
                            ) : ownerInfo ? (
                                `${ownerInfo.name} ${ownerInfo.surname} (${ownerInfo.login})`
                            ) : (
                                "Неизвестно"
                            )}
                        </p>


                        <div>
                            <h4 className="font-semibold mb-2">Участники команды:</h4>
                            <div className="flex flex-wrap gap-2">
                                {team.users.length ? (
                                    team.users.map((member) => (
                                        <Chip
                                            key={member.id}
                                            variant="flat"
                                            onClose={canManageTeam ? () => handleRemoveMember(member.id) : undefined}
                                            className={canManageTeam ? "cursor-pointer" : ""}
                                            endContent={canManageTeam ? <X size={16} /> : null}
                                        >
                                            {member.name} {member.surname} ({member.login})
                                            {isRemovingMember && <Spinner size="sm" className="ml-2" />}
                                        </Chip>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">В команде пока нет участников.</p>
                                )}
                            </div>
                        </div>

                        {canManageTeam && (
                            <Button
                                startContent={<UserPlus size={18} />}
                                onPress={onOpenAddUserModal}
                                color="primary"
                                variant="flat"
                            >
                                Добавить участника
                            </Button>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {canManageTeam && (
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleDeleteTeam}
                                isLoading={isDeleting}
                                disabled={isDeleting}
                                startContent={<Trash2 size={18} />}
                            >
                                {isDeleting ? "Удаление..." : "Удалить команду"}
                            </Button>
                        )}
                        <Button onPress={onClose}>Закрыть</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isAddUserModalOpen} onClose={onCloseAddUserModal} size="md">
                <ModalContent>
                    <ModalHeader>Добавить участника в "{team.name}"</ModalHeader>
                    <ModalBody className="flex flex-col gap-4">
                        <Input
                            label="Поиск пользователя"
                            placeholder="Введите имя или логин"
                            value={participantQuery}
                            onChange={(e) => onParticipantQueryChange(e.target.value)}
                        />

                        {loadingUsers ? (
                            <div className="flex justify-center py-4">
                                <Spinner size="md" label="Поиск пользователей..." />
                            </div>
                        ) : foundUsers.length > 0 ? (
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                                {foundUsers.map(
                                    (user) =>
                                        !isMember(user.id) && (
                                            <button
                                                key={user.id}
                                                className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                                                onClick={() => handleAddMember(user)}
                                                disabled={isAddingMember}
                                            >
                                                {user.name} {user.surname} ({user.login})
                                                {isAddingMember && <Spinner size="sm" className="ml-2" />}
                                            </button>
                                        )
                                )}
                            </div>
                        ) : debouncedParticipantQuery.length >= 2 && !loadingUsers ? (
                            <p className="text-sm text-gray-500">Пользователи не найдены.</p>
                        ) : (
                            <p className="text-sm text-gray-500">Введите не менее 2 символов для поиска.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onCloseAddUserModal}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}