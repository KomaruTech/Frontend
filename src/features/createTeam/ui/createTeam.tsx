import { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  addToast,
  Chip,
  Spinner,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { teamSchema } from "@shared/lib/utils/validationTeam";
import { searchUsers, type UserSearchResponse } from "@features/post-event/api/postEventApi";
import { createTeam } from "@features/createTeam/api/createTeamApi";
import axios from "axios";

interface CreateTeamCardProps {
  onCreateTeam?: () => void;
}

type TeamFormErrors = {
  name?: string;
  description?: string;
  userIds?: string;
};

export default function CreateTeamCard({ onCreateTeam }: CreateTeamCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [participantQuery, setParticipantQuery] = useState("");
  const [debouncedParticipantQuery, setDebouncedParticipantQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<UserSearchResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, UserSearchResponse>>({});
  const [userIds, setUserIds] = useState<string[]>([]);

  const [errors, setErrors] = useState<TeamFormErrors | null>(null);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

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
              console.warn("Неверный формат ответа searchUsers API:", res); // Переведено
            }
          })
          .catch((err) => {
            console.error("Ошибка при поиске пользователей:", err); // Переведено
            setFoundUsers([]);
          })
          .finally(() => setLoadingUsers(false));
    } else {
      setFoundUsers([]);
    }
  }, [debouncedParticipantQuery]);


  const addUser = (user: UserSearchResponse) => {
    if (!userIds.includes(user.id)) {
      setUserIds([...userIds, user.id]);
      setSelectedUsers((prev) => ({ ...prev, [user.id]: user }));
    }
    setParticipantQuery("");
    setDebouncedParticipantQuery("");
    setFoundUsers([]);
  };

  const removeUser = (id: string) => {
    setUserIds(userIds.filter((uid) => uid !== id));
    setSelectedUsers((prev) => {
      const newObj = { ...prev };
      delete newObj[id];
      return newObj;
    });
  };

  const handleSubmit = async () => {
    const result = teamSchema.safeParse({ name, description, userIds });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        description: flat.description?.[0],
        userIds: flat.userIds?.[0],
      });
      addToast({
        title: "Ошибка валидации", // Переведено
        description: "Пожалуйста, заполните все обязательные поля корректно.", // Переведено
        color: "danger",
      });
      return;
    }

    try {
      const newTeam = await createTeam({ name, description, userIds });

      onClose();
      addToast({
        title: "Успешно", // Переведено
        description: `Команда "${newTeam.name}" создана!`, // Переведено
        color: "success",
      });

      setName("");
      setDescription("");
      setUserIds([]);
      setSelectedUsers({});
      setParticipantQuery("");
      setDebouncedParticipantQuery("");
      setFoundUsers([]);
      setErrors(null);

      onCreateTeam?.();
    } catch (error) {
      let errorMessage = "Не удалось создать команду"; // Переведено
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      addToast({
        title: "Ошибка", // Переведено
        description: errorMessage,
        color: "danger",
      });
    }
  };

  return (
      <>
        <div className="flex justify-center my-4 items-center">
          <div
              onClick={onOpen}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer select-none"
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">Создать команду</span> {/* Переведено */}
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalContent>
            <ModalHeader>Создать новую команду</ModalHeader> {/* Переведено */}
            <ModalBody className="flex flex-col gap-4">
              <Input
                  label="Название команды" // Переведено
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!errors?.name}
                  errorMessage={errors?.name}
              />

              <Input
                  label="Описание" // Переведено
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isInvalid={!!errors?.description}
                  errorMessage={errors?.description}
              />

              <Input
                  label="Добавить участника по логину или имени" // Переведено
                  placeholder="Введите имя или логин" // Переведено
                  value={participantQuery}
                  onChange={(e) => onParticipantQueryChange(e.target.value)}
                  isInvalid={!!errors?.userIds}
                  errorMessage={errors?.userIds}
              />

              {loadingUsers ? (
                  <div className="flex justify-center py-4">
                    <Spinner size="md" label="Поиск пользователей..." /> {/* Переведено */}
                  </div>
              ) : foundUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                    {foundUsers.map((user) =>
                        !userIds.includes(user.id) ? (
                            <button
                                key={user.id}
                                className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                                onClick={() => addUser(user)}
                            >
                              {user.name} {user.surname} ({user.login})
                            </button>
                        ) : null
                    )}
                  </div>
              ) : debouncedParticipantQuery.length >= 2 && !loadingUsers ? (
                  <p className="text-sm text-gray-500">Пользователи не найдены.</p>
                ) : (
                <p className="text-sm text-gray-500">Введите не менее 2 символов для поиска.</p>
                )}

              <div className="flex flex-wrap gap-2 mt-2">
                {userIds.length > 0 ? (
                    userIds.map((id) => {
                      const user = selectedUsers[id];
                      return (
                          <Chip key={id} variant="flat" onClose={() => removeUser(id)}>
                            {user ? `${user.name} ${user.surname}` : `ID: ${id}`}
                          </Chip>
                      );
                    })
                ) : (
                    <p className="text-sm text-gray-500">Участники не выбраны.</p>
                  )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Отмена {/* Переведено */}
              </Button>
              <Button onPress={handleSubmit}>Создать</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}