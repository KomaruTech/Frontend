import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
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

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    addToast({ title: "Заявка одобрена", color: "success" });
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    addToast({ title: "Заявка отклонена", color: "danger" });
  };

  return (
    <div className="w-[700px] max-h-[400px] overflow-y-auto space-y-4">
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">Нет активных заявок</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            className="cursor-default border border-blue-500 rounded-xl p-4 shadow-md hover:shadow-lg transition w-[600px] ml-[50px]"
          >
            <h2 className="text-md font-semibold">{request.title}</h2>
            <p className="text-sm font-medium text-gray-700">{request.description}</p>

            <div className="flex gap-4 mt-3 text-sm text-gray-700 items-center">
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {request.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {request.time}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
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
  );
}
