import React, { useState, useEffect } from "react";
import { Plus, X, Search, User } from "lucide-react";
import {DateRangePicker, type RangeValue} from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { type ZonedDateTime } from "@internationalized/date";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  avatar?: string;
}

export default function OfferEventCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    dateRange: { start: null as string | null, end: null as string | null },
    address: "",
    participants: [] as User[],
    teams: [] as Team[],
    keywords: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamSearchResults, setTeamSearchResults] = useState<Team[]>([]);
  const [showTeamResults, setShowTeamResults] = useState(false);

  const [keywordInput, setKeywordInput] = useState("");

  const mockUsers: User[] = [
    { id: "1", name: "Иван Иванов", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Петр Петров", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Мария Сидорова", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Анна Кузнецова", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: "5", name: "Сергей Смирнов", avatar: "https://i.pravatar.cc/150?img=5" },
  ];

  const mockTeams: Team[] = [
    { id: "t1", name: "Команда Альфа", avatar: "https://i.pravatar.cc/150?img=6" },
    { id: "t2", name: "Команда Браво", avatar: "https://i.pravatar.cc/150?img=7" },
    { id: "t3", name: "Команда Чарли", avatar: "https://i.pravatar.cc/150?img=8" },
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    if (teamSearchQuery.trim() === "") {
      setTeamSearchResults([]);
      return;
    }

    const results = mockTeams.filter((team) =>
        team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );
    setTeamSearchResults(results);
  }, [teamSearchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (
      e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const addParticipant = (user: User) => {
    if (!form.participants.some((p) => p.id === user.id)) {
      setForm({
        ...form,
        participants: [...form.participants, user],
      });
    }
    setSearchQuery("");
    setShowResults(false);
  };

  const removeParticipant = (userId: string) => {
    setForm({
      ...form,
      participants: form.participants.filter((user) => user.id !== userId),
    });
  };

  const addTeam = (team: Team) => {
    if (!form.teams.some((t) => t.id === team.id)) {
      setForm({
        ...form,
        teams: [...form.teams, team],
      });
    }
    setTeamSearchQuery("");
    setShowTeamResults(false);
  };

  const removeTeam = (teamId: string) => {
    setForm({
      ...form,
      teams: form.teams.filter((t) => t.id !== teamId),
    });
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !form.keywords.includes(trimmed)) {
      setForm({ ...form, keywords: [...form.keywords, trimmed] });
    }
    setKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    setForm({
      ...form,
      keywords: form.keywords.filter((k) => k !== keyword),
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "",
      dateRange: { start: null, end: null },
      address: "",
      participants: [],
      teams: [],
      keywords: [],
    });
    setErrors({});
    setSearchQuery("");
    setKeywordInput("");
    setTeamSearchQuery("");
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Валидация диапазона дат
    if (!form.dateRange.start) {
      newErrors.dateRange = "Дата начала обязательна";
    } else {
      const startDate = new Date(form.dateRange.start + "T00:00");
      if (startDate < now) {
        newErrors.dateRange = "Дата начала не может быть раньше текущей";
      }
    }

    if (form.title.length < 4 || form.title.length > 64) {
      newErrors.title = "Название должно быть от 4 до 64 символов";
    }

    if (form.description.length < 16 || form.description.length > 10000) {
      newErrors.description = "Описание должно быть от 16 до 10000 символов";
    }

    if (!form.type) {
      newErrors.type = "Выберите тип мероприятия";
    }

    return newErrors;
  };

  const handleDateChange = (value: RangeValue<ZonedDateTime> | null) => {
    if (!value) {
      setForm(f => ({ ...f, dateRange: { start: null, end: null } }));
      setErrors(e => ({ ...e, dateRange: "" }));
      return;
    }
    const start = value.start?.toString().slice(0, 10) ?? null;
    const end   = value.end?.toString().slice(0, 10)   ?? null;
    setForm(f => ({ ...f, dateRange: { start, end } }));
    setErrors(e => ({ ...e, dateRange: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Данные формы отправлены:", form);
    setIsOpen(false);
    resetForm();
  };

  return (
      <>
        <div className="w-full bg-[#004e9e] text-white rounded-xl p-4 shadow-md flex justify-between items-center relative overflow-hidden font-sans">
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

          <button
              onClick={() => setIsOpen(true)}
              className="z-10 bg-white text-black p-2 rounded-md shadow-md ml-2"
          >
            <Plus size={18} />
          </button>
        </div>
        {isOpen && (
            <div
                className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto p-4"
            >
              <div
                  className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
              >
                <button
                    onClick={() => {
                      setIsOpen(false);
                      resetForm();
                    }}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                  <X />
                </button>
                <h2 className="text-xl font-semibold mb-4">Новое мероприятие</h2>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                  <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Название мероприятия *"
                      className={`border rounded p-2 w-full ${
                          errors.title ? "border-red-500" : ""
                      }`}
                  />
                  {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                  <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Описание мероприятия *"
                      className={`border rounded p-2 w-full ${
                          errors.description ? "border-red-500" : ""
                      }`}
                  />
                  {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                  <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={`border rounded p-2 w-full ${
                          errors.type ? "border-red-500" : ""
                      }`}
                  >
                    <option value="">Выберите тип мероприятия *</option>
                    <option value="Общее">Общее</option>
                    <option value="Групповое">Групповое</option>
                    <option value="Личное">Личное</option>
                  </select>
                  {errors.type && (
                      <p className="text-red-500 text-sm">{errors.type}</p>
                  )}
                  <div className="rounded w-full">
                    <DateRangePicker
                        hideTimeZone
                        defaultValue={{
                          start: form.dateRange.start
                              ? parseZonedDateTime(form.dateRange.start + "T00:00[Europe/Moscow]")
                              : parseZonedDateTime("2025-04-01T00:45[Europe/Moscow]"),
                          end: form.dateRange.end
                              ? parseZonedDateTime(form.dateRange.end   + "T00:00[Europe/Moscow]")
                              : parseZonedDateTime("2025-04-08T11:15[Europe/Moscow]"),
                        }}
                        label="Выберите дату *"
                        visibleMonths={2}
                        onChange={handleDateChange}
                    />
                  </div>
                  {errors.dateRange && (
                      <p className="text-red-500 text-sm">{errors.dateRange}</p>
                  )}

                  <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Адрес / URL"
                      className={`border rounded p-2 w-full ${
                          errors.address ? "border-red-500" : ""
                      }`}
                  />
                  {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                  {form.type !== "Групповое" && (
                      <>
                        <div className="relative">
                          <div className="flex items-center border rounded p-2">
                            <Search className="text-gray-400 mr-2" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowResults(true)}
                                placeholder="Добавить участников"
                                className="w-full outline-none"
                            />
                          </div>

                          {showResults && searchResults.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => addParticipant(user)}
                                    >
                                      {user.avatar ? (
                                          <img
                                              src={user.avatar}
                                              alt={user.name}
                                              className="w-8 h-8 rounded-full mr-2"
                                          />
                                      ) : (
                                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                            <User size={16} className="text-gray-500" />
                                          </div>
                                      )}
                                      <span>{user.name}</span>
                                    </div>
                                ))}
                              </div>
                          )}
                        </div>

                        {/* Выбранные участники */}
                        {form.participants.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {form.participants.map((user) => (
                                  <div
                                      key={user.id}
                                      className="flex items-center bg-blue-50 rounded-full px-3 py-1"
                                  >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                          <User size={12} className="text-gray-500" />
                                        </div>
                                    )}
                                    <span className="text-sm mr-2">{user.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeParticipant(user.id)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                              ))}
                            </div>
                        )}
                      </>
                  )}

                  {form.type === "Групповое" && (
                      <>
                        <div className="relative">
                          <div className="flex items-center border rounded p-2">
                            <Search className="text-gray-400 mr-2" size={18} />
                            <input
                                type="text"
                                value={teamSearchQuery}
                                onChange={(e) => setTeamSearchQuery(e.target.value)}
                                onFocus={() => setShowTeamResults(true)}
                                placeholder="Добавить команды"
                                className="w-full outline-none"
                            />
                          </div>

                          {showTeamResults && teamSearchResults.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                                {teamSearchResults.map((team) => (
                                    <div
                                        key={team.id}
                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => addTeam(team)}
                                    >
                                      {team.avatar ? (
                                          <img
                                              src={team.avatar}
                                              alt={team.name}
                                              className="w-8 h-8 rounded-full mr-2"
                                          />
                                      ) : (
                                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                            <User size={16} className="text-gray-500" />
                                          </div>
                                      )}
                                      <span>{team.name}</span>
                                    </div>
                                ))}
                              </div>
                          )}
                        </div>
                        {form.teams.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {form.teams.map((team) => (
                                  <div
                                      key={team.id}
                                      className="flex items-center bg-blue-50 rounded-full px-3 py-1"
                                  >
                                    {team.avatar ? (
                                        <img
                                            src={team.avatar}
                                            alt={team.name}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                          <User size={12} className="text-gray-500" />
                                        </div>
                                    )}
                                    <span className="text-sm mr-2">{team.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTeam(team.id)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                              ))}
                            </div>
                        )}
                      </>
                  )}

                  <div>
                    <label className="text-sm font-normal text-gray-400 mb-1">
                      Ключевые слова
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addKeyword();
                            }
                          }}
                          placeholder="Введите ключевое слово и нажмите Enter"
                          className="border rounded p-2 w-full"
                      />
                      <button
                          type="button"
                          onClick={addKeyword}
                          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
                      >
                        Добавить
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.keywords.map((kw) => (
                          <div
                              key={kw}
                              className="bg-blue-50 rounded-full px-3 py-1 flex items-center gap-1"
                          >
                            <span className="text-sm">{kw}</span>
                            <button
                                type="button"
                                onClick={() => removeKeyword(kw)}
                                className="text-gray-500 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                      ))}
                    </div>
                  </div>

                  <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Создать мероприятие
                  </button>
                </form>
              </div>
            </div>
        )}
      </>
  );
}