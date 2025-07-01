import { useState } from "react";
import OfferEventCar from "@/pages/Home/ui/NewIvent";
import Main_menu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";
import { CustomCalendar } from "@widgets/CustomCalendar";
import { Calendar, Clock, X } from "lucide-react";
import { addToast } from "@heroui/react";

interface Event {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  type?: string;
  address?: string;
  creator?: string;
  keywords?: string[];
}

const pastEvents: Event[] = [
  {
    id: 1,
    title: "Событие 1",
    subtitle: "One on One",
    description: "Встреча для решения вопросов по проекту",
    date: "12.07.2025",
    time: "12:00 – 14:00",
    type: "Личное",
    address: "Zoom",
    creator: "Иван Иванов",
    keywords: ["встреча", "обсуждение", "личное"],
  },
  {
    id: 3,
    title: "Событие 3",
    subtitle: "Teambuilding",
    description: "Настольные игры с командой",
    date: "18.07.2025",
    time: "13:00 – 14:00",
    type: "Групповое",
    address: "г. Казань, Коворкинг 'Старт'",
    creator: "Мария Петрова",
    keywords: ["команда", "игры", "тимбилдинг"],
  },
  {
    id: 5,
    title: "Событие 5",
    subtitle: "Ретроспектива",
    description: "Анализ завершённых проектов",
    date: "10.06.2025",
    time: "10:00 – 12:00",
    type: "Общее",
    address: "Офис, переговорная 2",
    creator: "Андрей Лебедев",
    keywords: ["ретроспектива", "аналитика"],
  },
  {
    id: 6,
    title: "Событие 6",
    subtitle: "UX review",
    description: "Оценка пользовательского интерфейса",
    date: "20.06.2025",
    time: "15:00 – 16:30",
    type: "Личное",
    address: "Google Meet",
    creator: "Елена Ковалева",
    keywords: ["UX", "оценка", "дизайн"],
  },
];

const upcomingEvents: Event[] = [
  {
    id: 2,
    title: "Событие 2",
    subtitle: "Конференция",
    description: "IT в науке и жизни",
    date: "14.07.2025",
    time: "18:00 – 20:00",
    type: "Общее",
    address: "г. Москва, ул. Технопарковая 5",
    creator: "Алексей Смирнов",
    keywords: ["IT", "наука", "жизнь"],
  },
  {
    id: 4,
    title: "Событие 4",
    subtitle: "Мастер класс",
    description: "Дизайн презентаций IT продуктов",
    date: "24.07.2025",
    time: "12:00 – 14:00",
    type: "Групповое",
    address: "г. СПб, Креативное пространство",
    creator: "Виктория Миронова",
    keywords: ["дизайн", "презентации", "мастер-класс"],
  },
  {
    id: 7,
    title: "Событие 7",
    subtitle: "Dev Meetup",
    description: "Встреча разработчиков проекта",
    date: "30.07.2025",
    time: "16:00 – 18:00",
    type: "Групповое",
    address: "г. Новосибирск, IT-хаб",
    creator: "Сергей Никитин",
    keywords: ["разработка", "встреча", "обсуждение"],
  },
  {
    id: 8,
    title: "Событие 8",
    subtitle: "Product Demo",
    description: "Демонстрация нового релиза",
    date: "05.08.2025",
    time: "11:00 – 12:30",
    type: "Общее",
    address: "Онлайн, YouTube Live",
    creator: "Команда DevOps",
    keywords: ["продукт", "демо", "релиз"],
  },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const events = activeTab === "past" ? pastEvents : upcomingEvents;

  const handleEnroll = () => {
    addToast({
      title: "Успешно!",
      description: "Вы записались на мероприятие",
      color: "success",
    });
    setSelectedEvent(null); // закрытие модального окна
  };

  return (
    <div className="flex flex-col lg:flex-row gap-20 px-8 py-14 relative">
      {/* Левая панель */}
      
      <Main_menu />
      {/* Основной контент */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Переключатель вкладок */}
        <div className="flex bg-gray-200 rounded-full p-1 w-fit">
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "past"
                ? "bg-gradient-to-r from-blue-600 to-blue-300 text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Твои мероприятия
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-blue-600 to-blue-300 text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Предстоящие
          </button>
        </div>

        {/* Список событий */}
        <div className="flex flex-col gap-4 max-w-3xl">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer border rounded-xl border-blue-500 p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-700">{event.subtitle}</p>
              <p className="text-sm text-gray-500">{event.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-600 items-center">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {event.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 order-1 lg:order-2 items-end max-h-[600px]">
        <Header />
        <div className="flex flex-col gap-4 h-full min-w-[320px] mr-[19px]">
          <OfferEventCar />
          <CustomCalendar />
        </div>
      </div>

      {/* Модальное окно */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-xl rounded-xl p-6 shadow-xl animate-fade-in relative">
            {/* Крестик */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-1">Тип: {selectedEvent.type}</p>
            <p className="text-gray-700 mb-1">Описание: {selectedEvent.description}</p>
            <p className="text-gray-700 mb-1">Дата: {selectedEvent.date}</p>
            <p className="text-gray-700 mb-1">Время: {selectedEvent.time}</p>
            <p className="text-gray-700 mb-1">Адрес: {selectedEvent.address}</p>
            <p className="text-gray-700 mb-4">Организатор: {selectedEvent.creator}</p>

            {selectedEvent.keywords && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Ключевые слова:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "upcoming" && (
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                onClick={handleEnroll}
              >
                Записаться на мероприятие
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
