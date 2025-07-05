import { addToast } from "@heroui/react";

const InvitationToEvent = () => {
  const handleCheckClick = () => {
    addToast({
      title: "Запись на мероприятие",
      description: "Вы успешно записались на мероприятие",
      color: "success",
    });
  };

  const handleCrossClick = () => {
    addToast({
      title: "Отказ от участия",
      description: "Вы отказались от участия в мероприятии",
      color: "danger",
    });
  };

  return (
    <div className="relative h-[590px] bg-gray-100">
      {/* Основной контент страницы */}

      {/* Блок в правом нижнем углу */}
      <div className="absolute right-4">
        <h1 className="text-xl mb-4">Приглашение На Мероприятие</h1>
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-lg shadow-lg w-[323px] max-w-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full opacity-50"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h2 className="text-lg font-bold">One-to-one</h2>
              <p className="text-sm">Обсуждение по код-ревью заказчика...</p>
            </div>
            <div className="text-right">
              <p className="text-sm">25 Июня, 11:00</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 relative z-10">
            <div className="flex -space-x-2">
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="Participant 1" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://avatars.githubusercontent.com/u/30373425?v=4" alt="Participant 2" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://via.placeholder.com/32" alt="Participant 3" />
            </div>
            <div className="flex space-x-2">
              <button className="bg-white text-blue-800 rounded p-2" onClick={handleCrossClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button className="bg-white text-blue-800 rounded p-2" onClick={handleCheckClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationToEvent;
