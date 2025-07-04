import { useState } from "react";
import BaseLayout from "@widgets/BaseLayout//ui/BaseLayout";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { CustomCalendar } from "@features/calendary";
import PastEventsList from "@features/events/ui/PastEventsList.tsx";
import type { Event } from "@entities/event";
import { Header } from "@widgets/Header";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
      <BaseLayout
          leftAside={<SidebarMenu />}
          rightAside={
            <>
              <Header />
              <OfferEventCar />
              <CustomCalendar />
            </>
          }
      >
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "past" ? (
              <PastEventsList
                  selectedEvent={selectedEvent}
                  onSelect={setSelectedEvent}
              />
          ) : (
              <></>
          )}
        </div>
      </BaseLayout>
  );
}
