import { useState, useRef, useEffect } from "react";
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
} from "@heroui/react";
import { Plus } from "lucide-react";
import { teamSchema, type TeamFormValues } from "@shared/lib/utils/validationTeam";

const mockUsers = [
  { id: "1", name: "Анна", surname: "Иванова", login: "anna123" },
  { id: "2", name: "Игорь", surname: "Смирнов", login: "igor_s" },
  { id: "3", name: "Мария", surname: "Кузнецова", login: "mkuz" },
];

export default function CreateTeamCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<typeof mockUsers>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof TeamFormValues, string>> | null>(null);

  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = mockUsers.filter(
        (u) =>
          u.login.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query) ||
          u.surname.toLowerCase().includes(query)
      );
      setFoundUsers(results);
    }, 300);
  }, [searchQuery]);

  const addUser = (user: typeof mockUsers[0]) => {
    if (!userIds.includes(user.id)) {
      setUserIds([...userIds, user.id]);
      setSelectedUsers((prev) => ({ ...prev, [user.id]: `${user.name} ${user.surname}` }));
    }
  };

  const removeUser = (id: string) => {
    setUserIds(userIds.filter((uid) => uid !== id));
    setSelectedUsers((prev) => {
      const newObj = { ...prev };
      delete newObj[id];
      return newObj;
    });
  };

  const handleSubmit = () => {
    const result = teamSchema.safeParse({ name, description, userIds });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        description: flat.description?.[0],
        userIds: flat.userIds?.[0],
      });
      return;
    }

    onClose();

    addToast({
      title: "Успешно",
      description: "Команда создана",
      color: "success",
    });

    setName("");
    setDescription("");
    setUserIds([]);
    setSelectedUsers({});
    setSearchQuery("");
    setFoundUsers([]);
    setErrors(null);
  };

  return (
    <>
      {/* Центрируем кнопку */}
      <div className="flex justify-center my-4 mr-[80px]">
        <div
          onClick={onOpen}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer select-none"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">Создать команду</span>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>Создание команды</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Название команды"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

            <Input
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

            <Input
              label="Добавить участника по логину или имени"
              placeholder="Введите имя или логин"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {errors?.userIds && <p className="text-red-500 text-sm mt-1">{errors.userIds}</p>}

            {foundUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {foundUsers.map((user) => (
                  <button
                    key={user.id}
                    className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                    onClick={() => addUser(user)}
                  >
                    {user.name} {user.surname} ({user.login})
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Пользователи не найдены</p>
            )}

            <div className="flex flex-wrap gap-2">
              {userIds.map((id) => (
                <Chip key={id} variant="flat" onClose={() => removeUser(id)}>
                  {selectedUsers[id] || id}
                </Chip>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
