import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const currentWeekData = [
  { day: "Sun", count: 0 },
  { day: "Mon", count: 7 },
  { day: "Tue", count: 4 },
  { day: "Wed", count: 6 },
  { day: "Thu", count: 9 },
  { day: "Fri", count: 6 },
  { day: "Sat", count: 10 },
];

const previousWeekData = [
  { day: "Sun", count: 1 },
  { day: "Mon", count: 4 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 5 },
  { day: "Thu", count: 6 },
  { day: "Fri", count: 2 },
  { day: "Sat", count: 9 },
];

export default function StatisticsCard() {
  const [selectedRange, setSelectedRange] = useState("Неделя");

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Твоя статистика</h2>
        <div className="relative inline-block text-left">
          <select
            className="bg-gray-100 rounded-md px-3 py-1 text-sm"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="Неделя">Неделя</option>
            <option value="Месяц">Месяц</option>
          </select>
        </div>
      </div>

      <p className="text-sm mb-3 text-gray-500">Посещенных мероприятий</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={currentWeekData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            data={previousWeekData}
            stroke="#D1D5DB"
            strokeWidth={2}
            dot={false}
            name="Прошлая"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#000000"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            name="Текущая"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
