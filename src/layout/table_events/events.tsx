import { Card, CardBody, Button } from "@heroui/react";

const events = [
  {
    title: "Событие 1",
    description: "One on One",
    date: "Пн, 24 июня",
    time: "10:00 - 10:30",
  },
  {
    title: "Событие 2",
    description: "Тимбилдинг",
    date: "Вт, 25 июня",
    time: "15:00 - 16:00",
  },
  {
    title: "Событие 3",
    description: "Митап",
    date: "Ср, 26 июня",
    time: "17:00 - 17:30",
  },
  {
    title: "Событие 4",
    description: "Код ревью",
    date: "Чт, 27 июня",
    time: "14:30 - 15:00",
  },
];

function WeeklyEvents() {
  return (
    <div className="flex items-start">
      {/* Фоновый блок */}
      <div
        className="w-[320px] h-auto p-4 rounded-2xl shadow-2xl relative"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Карточка */}
        <Card className="w-[260px] mx-auto rounded-xl overflow-hidden shadow-lg">
          <CardBody className="bg-white px-3 py-4 text-black">
            <h2 className="font-involve text-[#004e9e] text-md font-semibold text-center mb-3">
              Мероприятия на неделю
            </h2>
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-md p-2 mb-3 shadow-sm"
              >
                <div className="font-involve text-[#004e9e] text-sm font-semibold truncate">
                  {event.title}
                </div>
                <div className="font-involve text-xs text-gray-700">
                  {event.description} 📅 {event.date}
                </div>
                <div className="font-involve text-[12px] text-gray-500 mt-1 leading-tight">
                  🕒 {event.time}
                </div>
                <Button
                  className="mt-2"
                  size="sm"
                  variant="bordered"
                  fullWidth
                  style={{
                    borderColor: "#004e9e",
                    color: "#004e9e",
                    fontSize: "12px",
                    height: "28px",
                  }}
                >
                  Присоединиться
                </Button>
              </div>
            ))}

            {/* Кнопка записи под мероприятиями */}
            <div >
              <Button color="primary" variant="shadow" fullWidth>
                Создать мероприятие
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default WeeklyEvents;
