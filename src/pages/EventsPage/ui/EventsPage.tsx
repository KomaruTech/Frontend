// src/pages/EventsPage/ui/EventsPage.tsx
import { useState } from "react";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";
import { CustomCalendar } from "@features/calendary";
// import { addToast } from "@heroui/react";
import PastEventsList from "@features/events/ui/PastEventsList.tsx";
// import UpcomingEventsList from "@features/events/ui/UpcomingEventsList.tsx";
import RequestsSection from "@features/applications/ui/application"
import type { Event } from "@entities/event";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
      <div className="flex bg-gray-100 min-h-screen">
        <main className="flex-1 p-8 mx-auto w-full max-w-[1920px] min-h-screen">
          <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
            <div className="order-1 lg:order-1">
              <SidebarMenu />
            </div>
            {/* Центральная часть */}
            <div className="flex-1 flex flex-col gap-6 order-2 lg:order-2">
              {/* Верхняя панель: табы и кнопка заявок */}
              <div className="flex items-center justify-between flex-wrap gap-4">
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
                <div>
                  <RequestsSection />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "past" ? (
                    <PastEventsList
                        selectedEvent={selectedEvent}
                        onSelect={setSelectedEvent}
                    />
                ) : (
                    // <UpcomingEventsList
                    //   events={upcomingEvents}
                    //   selectedEvent={selectedEvent}
                    //   onSelect={setSelectedEvent}
                    //   onEnroll={handleEnroll}
                    // />
                    <></>
                )}
              </div>
            </div>

            {/* Правая колонка */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 order-3 items-end max-h-[600px]">
              <Header />
              <div className="flex flex-col gap-4 h-full min-w-[320px] mr-[19px]">
                <OfferEventCar />
                <CustomCalendar />
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
