import { useState, useRef, useEffect } from "react";
import { addToast } from "@heroui/react";

interface Request {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
}

const initialRequests: Request[] = [
  {
    id: 1,
    title: "One on One",
    description: "Встреча для решения вопросов по проекту",
    date: "12.07.2025",
    time: "12:00 – 14:00",
  },
  {
    id: 2,
    title: "Team Sync",
    description: "IT в науке и жизни",
    date: "14.07.2025",
    time: "18:00 – 20:00",
  },
];

export default function RequestsSection() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне блока
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    addToast({ title: "Заявка одобрена", color: "success" });
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    addToast({ title: "Заявка отклонена", color: "danger" });
  };

  return (
    <div className="relative w-fit" ref={containerRef}>
      {/* Кнопка */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
      >
        Заявки на мероприятия
      </button>

      {/* Выпадающий список */}
      {isVisible && (
        <div className="absolute z-40 mt-2 bg-white border border-blue-300 rounded-xl shadow-lg p-4 w-[320px] max-h-[400px] overflow-y-auto">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">Нет активных заявок</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-100 border border-blue-200 rounded-lg p-3 mb-3"
              >
                <p className="text-base font-semibold">{request.title}</p>
                <p className="text-sm text-gray-700">{request.description}</p>
                <div className="flex gap-4 text-xs text-gray-600 mt-2">
                  <span>📅 {request.date}</span>
                  <span>⏰ {request.time}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Принять
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
