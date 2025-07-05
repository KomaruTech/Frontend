import { useState } from "react";
import BaseLayout from "@widgets/BaseLayout//ui/BaseLayout";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { CustomCalendar } from "@features/calendary";
import PastEventsList from "@features/events/ui/PastEventsList.tsx";
import RequestsSection from "@features/applications/ui/application";
import type { Event } from "@entities/event";
import { Header } from "@widgets/Header";
import TabSwitcher from "@widgets/TabSwitcher";
import type {TabItem} from "@widgets/TabSwitcher/ui/TabSwitcher.tsx";

type TabKey = "past" | "upcoming";

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("past");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const tabOptions: TabItem<TabKey>[] = [
        { label: "Твои мероприятия", value: "past" },
        { label: "Предстоящие", value: "upcoming" },
    ];

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
                <TabSwitcher<TabKey>
                    tabs={tabOptions}
                    activeTab={activeTab}
                    onTabChange={(value) => setActiveTab(value)}
                />
                <RequestsSection />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "past" && (
                    <PastEventsList
                        selectedEvent={selectedEvent}
                        onSelect={setSelectedEvent}
                    />
                )}
                {activeTab === "upcoming"}
            </div>
        </BaseLayout>
    );
}
// return (
//     <BaseLayout
//         leftAside={<SidebarMenu />}
//         rightAside={
//             <>
//                 <Header />
//                 <OfferEventCar />
//                 <CustomCalendar />
//             </>
//         }
//     >
//         <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex bg-gray-200 rounded-full p-1 w-fit">
//                 <button
//                     onClick={() => setActiveTab("past")}
//                     className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
//                         activeTab === "past"
//                             ? "bg-gradient-to-r from-blue-600 to-blue-300 text-white"
//                             : "text-gray-600 hover:text-black"
//                     }`}
//                 >
//                     Твои мероприятия
//                 </button>
//                 <button
//                     onClick={() => setActiveTab("upcoming")}
//                     className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
//                         activeTab === "upcoming"
//                             ? "bg-gradient-to-r from-blue-600 to-blue-300 text-white"
//                             : "text-gray-600 hover:text-black"
//                     }`}
//                 >
//                     Предстоящие
//                 </button>
//             </div>
//         </div>
//
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {activeTab === "past" ? (
//                 <PastEventsList
//                     selectedEvent={selectedEvent}
//                     onSelect={setSelectedEvent}
//                 />
//             ) : (
//                 <></>
//             )}
//         </div>
//     </BaseLayout>