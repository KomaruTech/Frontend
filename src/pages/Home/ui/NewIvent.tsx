import React, { useState, useEffect } from "react";
import { Plus, X, Search, User } from "lucide-react";
import {eventSchema} from '@shared/lib/utils/validationSchemas';
import * as yup from 'yup';

interface User {
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
    startTime: "",
    endTime: "",
    address: "",
    participants: [] as User[],
    keywords: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const mockUsers: User[] = [
    { id: "1", name: "Иван Иванов", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Петр Петров", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Мария Сидорова", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Анна Кузнецова", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: "5", name: "Сергей Смирнов", avatar: "https://i.pravatar.cc/150?img=5" },
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery, mockUsers]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const addParticipant = (user: User) => {
    if (!form.participants.some(p => p.id === user.id)) {
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
      participants: form.participants.filter(user => user.id !== userId),
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
      keywords: form.keywords.filter(k => k !== keyword),
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "",
      startTime: "",
      endTime: "",
      address: "",
      participants: [],
      keywords: [],
    });
    setErrors({});
    setSearchQuery("");
    setKeywordInput("");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventSchema.validate(form, { abortEarly: false });
      setErrors({});
      console.log("Данные формы отправлены:", form);
      setIsOpen(false);
      resetForm();
    } catch(err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
      <>
        <div className="w-full bg-[#0047FF] text-white rounded-xl p-4 shadow-md flex justify-between items-center relative overflow-hidden font-sans">
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            <svg className="absolute right-0 bottom-0 opacity-10 w-28 h-28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="10" />
            </svg>
          </div>

          <div className="z-10">
            <h3 className="text-sm font-semibold">Предложить мероприятие</h3>
            <p className="text-xs text-gray-300">Оставить заявку</p>
          </div>

          <button
              onClick={() => setIsOpen(true)}
              className="z-10 bg-white text-black p-2 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Модальное окно */}
        {isOpen && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 font-sans">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => {
                      setIsOpen(false);
                      resetForm();
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={20}/>
                </button>
                <h2 className="text-xl font-bold mb-5 text-gray-800">Новое мероприятие</h2>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} noValidate>

                  {/* Название */}
                  <div>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Название мероприятия *"
                        className={`border rounded-lg p-2 w-full transition-colors ${errors.title ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`}
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                  </div>

                  {/* Описание */}
                  <div>
                  <textarea
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Описание мероприятия *"
                      className={`border rounded-lg p-2 w-full transition-colors ${errors.description ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`}
                  />
                    {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                  </div>

                  {/* Тип мероприятия */}
                  <div>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={`border rounded-lg p-2 w-full transition-colors ${errors.type ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`}
                    >
                      <option value="">Выберите тип мероприятия *</option>
                      <option value="Общее">Общее</option>
                      <option value="Групповое">Групповое</option>
                      <option value="Личное">Личное</option>
                    </select>
                    {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type}</p>}
                  </div>
                  {/* Время начала и окончания */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full">
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Время начала *</label>
                      <input
                          type="time"
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          className={`border rounded-lg p-2 w-full transition-colors ${errors.startTime ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`}
                      />
                      {errors.startTime && <p className="text-red-600 text-xs mt-1">{errors.startTime}</p>}
                    </div>

                    <div className="w-full">
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Время окончания</label>
                      <input
                          type="time"
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          className={`border rounded-lg p-2 w-full transition-colors ${errors.endTime ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`}
                      />
                      {errors.endTime && <p className="text-red-600 text-xs mt-1">{errors.endTime}</p>}
                    </div>
                  </div>

                  {/* Адрес / URL */}
                  <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Адрес / URL"
                      className="border rounded-lg p-2 w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  {/* Поиск участников */}
                  <div className="relative">
                    <div className="flex items-center border rounded-lg p-2 border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <Search className="text-gray-400 mr-2" size={20} />
                      <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => setShowResults(true)}
                          onBlur={() => setTimeout(() => setShowResults(false), 200)}
                          placeholder="Добавить участников"
                          className="w-full outline-none bg-transparent"
                      />
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {searchResults.map(user => (
                              <div
                                  key={user.id}
                                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => addParticipant(user)}
                              >
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                      <User size={16} className="text-gray-500" />
                                    </div>
                                )}
                                <span className="text-sm text-gray-700">{user.name}</span>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                  {form.participants.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                        {form.participants.map(user => (
                            <div key={user.id} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                              {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
                              ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                    <User size={12} className="text-gray-600" />
                                  </div>
                              )}
                              <span className="font-medium">{user.name}</span>
                              <button
                                  type="button"
                                  onClick={() => removeParticipant(user.id)}
                                  className="ml-2 text-blue-600 hover:text-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                        ))}
                      </div>
                  )}

                  {/* Ключевые слова */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Ключевые слова</label>
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
                          className="border rounded-lg p-2 w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                          type="button"
                          onClick={addKeyword}
                          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Добавить
                      </button>
                    </div>

                    {form.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                          {form.keywords.map((kw) => (
                              <div key={kw} className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                                <span className="mr-2 font-medium">{kw}</span>
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
                    )}
                  </div>

                  {/* Кнопка отправки */}
                  <button
                      type="submit"
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors w-full font-bold mt-2"
                  >
                    Отправить
                  </button>
                </form>
              </div>
            </div>
        )}
      </>
  );
}
