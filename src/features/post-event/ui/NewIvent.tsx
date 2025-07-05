import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Spinner,
  Chip,
  addToast,
} from "@heroui/react";
import { Plus } from "lucide-react";
import {
  postEventSuggestion,
  searchUsers,
  searchTeams,
  type UserSearchResponse,
  type TeamSearchResponse,
} from "../api/postEventApi"; // поправлен путь

function toLocalDateTimeInputValue(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function CustomDateRangePicker({
                                        value,
                                        onChange,
                                        label,
                                      }: {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
  label?: string;
}) {
  const [start, setStart] = useState(
      value.start || toLocalDateTimeInputValue(new Date())
  );
  const [end, setEnd] = useState(
      value.end || toLocalDateTimeInputValue(new Date())
  );

  useEffect(() => {
    setStart(value.start || toLocalDateTimeInputValue(new Date()));
    setEnd(value.end || toLocalDateTimeInputValue(new Date()));
  }, [value]);

  const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStart(newStart);
    if (newStart > end) {
      setEnd(newStart);
      onChange({ start: newStart, end: newStart });
    } else {
      onChange({ start: newStart, end });
    }
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    if (newEnd < start) {
      setStart(newEnd);
      onChange({ start: newEnd, end: newEnd });
    } else {
      onChange({ start, end: newEnd });
    }
  };

  return (
      <div className="flex flex-col gap-2">
        {label && <label className="font-semibold">{label}</label>}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm">Начало</label>
            <input
                type="datetime-local"
                value={start}
                onChange={onStartChange}
                className="p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">Конец</label>
            <input
                type="datetime-local"
                value={end}
                onChange={onEndChange}
                className="p-2 border rounded"
            />
          </div>
        </div>
      </div>
  );
}

export default function OfferEventCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"general" | "group" | "personal">(
      "general"
  );

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  const [participantQuery, setParticipantQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");

  const [debouncedParticipantQuery, setDebouncedParticipantQuery] =
      useState("");
  const [debouncedTeamQuery, setDebouncedTeamQuery] = useState("");

  const participantTimer = useRef<NodeJS.Timeout | null>(null);
  const teamTimer = useRef<NodeJS.Timeout | null>(null);

  const [foundUsers, setFoundUsers] = useState<UserSearchResponse[]>([]);
  const [foundTeams, setFoundTeams] = useState<TeamSearchResponse[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const initialDateTime = toLocalDateTimeInputValue(new Date());
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: initialDateTime,
    end: initialDateTime,
  });

  const onParticipantQueryChange = (value: string) => {
    setParticipantQuery(value);
    if (participantTimer.current) clearTimeout(participantTimer.current);
    participantTimer.current = setTimeout(() => {
      setDebouncedParticipantQuery(value);
    }, 400);
  };

  const onTeamQueryChange = (value: string) => {
    setTeamQuery(value);
    if (teamTimer.current) clearTimeout(teamTimer.current);
    teamTimer.current = setTimeout(() => {
      setDebouncedTeamQuery(value);
    }, 400);
  };

  useEffect(() => {
    if (type === "personal" && debouncedParticipantQuery.length >= 2) {
      setLoadingUsers(true);
      searchUsers(debouncedParticipantQuery)
          .then((res) => {
            if (Array.isArray(res)) {
              setFoundUsers(res);
            } else if (res && Array.isArray((res as any).data)) {
              setFoundUsers((res as any).data);
            } else {
              setFoundUsers([]);
              console.warn("Неверный формат ответа searchUsers:", res);
            }
          })
          .catch(() => {
            setFoundUsers([]);
          })
          .finally(() => setLoadingUsers(false));
    } else {
      setFoundUsers([]);
    }
  }, [debouncedParticipantQuery, type]);

  useEffect(() => {
    if (type === "group" && debouncedTeamQuery.length >= 2) {
      setLoadingTeams(true);
      searchTeams(debouncedTeamQuery)
          .then((res) => {
            if (Array.isArray(res)) {
              setFoundTeams(res);
            } else if (res && Array.isArray((res as any).data)) {
              setFoundTeams((res as any).data);
            } else {
              setFoundTeams([]);
              console.warn("Неверный формат ответа searchTeams:", res);
            }
          })
          .catch(() => {
            setFoundTeams([]);
          })
          .finally(() => setLoadingTeams(false));
    } else {
      setFoundTeams([]);
    }
  }, [debouncedTeamQuery, type]);

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async () => {
    if (!range.start || !range.end) {
      addToast({
        title: "Ошибка",
        description: "Пожалуйста, выберите диапазон времени.",
        color: "danger",
      });
      return;
    }
    try {
      await postEventSuggestion({
        name,
        description,
        location,
        timeStart: new Date(range.start).toISOString(),
        timeEnd: new Date(range.end).toISOString(),
        type,
        keywords,
        participants,
        teams,
      });
      onClose();

      addToast({
        title: "Успех",
        description: "Мероприятие успешно отправлено.",
        color: "success",
      });

      // Сброс формы
      setName("");
      setDescription("");
      setLocation("");
      setType("general");
      setKeywords([]);
      setKeywordInput("");
      setParticipants([]);
      setTeams([]);
      setParticipantQuery("");
      setTeamQuery("");
      setDebouncedParticipantQuery("");
      setDebouncedTeamQuery("");
      setRange({ start: initialDateTime, end: initialDateTime });
    } catch (error: any) {
      addToast({
        title: "Ошибка",
        description: error.message || "Ошибка при отправке",
        color: "danger",
      });
    }
  };

  return (
      <>
        <div
            onClick={onOpen}
            className="w-full bg-[#004e9e] text-white rounded-xl p-4 shadow-md flex justify-between items-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            <svg
                className="absolute right-0 bottom-0 opacity-10 w-28 h-28"
                viewBox="0 0 100 100"
                fill="none"
            >
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="10" />
            </svg>
          </div>
          <div className="z-10">
            <h3 className="text-sm font-semibold">Предложить мероприятие</h3>
            <p className="text-xs text-gray-400">Оставить заявку</p>
          </div>
          <button className="z-10 bg-white text-black p-2 rounded-md shadow-md ml-2">
            <Plus size={18} />
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader>Предложить мероприятие</ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input
                  label="Название"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
              <Input
                  label="Описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                  label="Локация"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
              />

              <CustomDateRangePicker label="Время проведения" value={range} onChange={setRange} />

              <label className="text-sm font-medium">Тип мероприятия</label>
              <select
                  className="p-2 rounded-md border border-gray-300"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as any);
                    setParticipants([]);
                    setTeams([]);
                  }}
              >
                <option value="general">Общее (для всех)</option>
                <option value="group">Групповое (для команды)</option>
                <option value="personal">Личное (для участников)</option>
              </select>

              {/* Ключевые слова */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Ключевые слова</label>
                <div className="flex gap-2 flex-wrap">
                  {keywords.map((keyword) => (
                      <Chip
                          key={keyword}
                          variant="flat"
                          onClose={() => removeKeyword(keyword)}
                      >
                        {keyword}
                      </Chip>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <input
                      type="text"
                      className="p-2 border rounded flex-1"
                      placeholder="Введите ключевое слово"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                  />
                  <Button onClick={addKeyword}>Добавить</Button>
                </div>
              </div>

              {type === "personal" && (
                  <>
                    <Input
                        label="Поиск участников"
                        placeholder="Введите имя или логин"
                        value={participantQuery}
                        onChange={(e) => onParticipantQueryChange(e.target.value)}
                    />
                    {loadingUsers ? (
                        <Spinner />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                          {foundUsers.map((user) => (
                              <button
                                  key={user.id}
                                  className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                                  onClick={() => {
                                    if (!participants.includes(user.id)) {
                                      setParticipants([...participants, user.id]);
                                    }
                                  }}
                              >
                                {user.name} {user.surname} ({user.login})
                              </button>
                          ))}
                        </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Выбранные ID: {participants.join(", ")}
                    </div>
                  </>
              )}

              {type === "group" && (
                  <>
                    <Input
                        label="Поиск команд"
                        placeholder="Введите название команды"
                        value={teamQuery}
                        onChange={(e) => onTeamQueryChange(e.target.value)}
                    />
                    {loadingTeams ? (
                        <Spinner />
                    ) : Array.isArray(foundTeams) && foundTeams.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {foundTeams.map((team) => (
                              <button
                                  key={team.id}
                                  className="px-2 py-1 bg-green-100 rounded hover:bg-green-200 text-sm"
                                  onClick={() => {
                                    if (!teams.includes(team.id)) {
                                      setTeams([...teams, team.id]);
                                    }
                                  }}
                              >
                                {team.name}
                              </button>
                          ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">Команды не найдены</div>
                    )}
                    <div className="text-xs text-gray-500">
                      Выбранные ID: {teams.join(", ")}
                    </div>
                  </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleSubmit}>Отправить</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}
