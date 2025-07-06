import {useState} from "react";
import BaseLayout from "@widgets/BaseLayout//ui/BaseLayout";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import {CustomCalendar} from "@features/calendary";
import PastEventsList from "@features/events/ui/PastEventsList.tsx";
import type {Event} from "@entities/event";
import {Header} from "@widgets/Header";
import TabSwitcher from "@widgets/TabSwitcher";
import type {TabItem} from "@widgets/TabSwitcher/ui/TabSwitcher.tsx";
import InvitedEventsList from "@features/events/ui/UpcomingEventsList.tsx";
import ProcessEventsList from "@features/events/ui/ProcessEventList.tsx";

type TabKey = "past" | "upcoming" | "process";

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("past");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const tabOptions: TabItem<TabKey>[] = [
        {label: "Твои мероприятия", value: "past"},
        {label: "Приглашения", value: "upcoming"},
        {label: "В обработке", value: "process"},
    ];

    return (
        <BaseLayout
            leftAside={<SidebarMenu/>}
            rightAside={
                <>
                    <Header/>
                    <OfferEventCar/>
                    <CustomCalendar/>
                </>
            }
        >
            <div className="flex items-center justify-between flex-wrap gap-4">
                <TabSwitcher<TabKey>
                    tabs={tabOptions}
                    activeTab={activeTab}
                    onTabChange={(value) => setActiveTab(value)}
                />
            </div>

            <div>
                {activeTab === "past" && (
                    <PastEventsList
                        selectedEvent={selectedEvent}
                        onSelect={setSelectedEvent}
                    />
                )}
                {activeTab === "upcoming" && <InvitedEventsList/>}
                {activeTab === "process" && <ProcessEventsList selectedEvent={selectedEvent}
                                                               onSelect={setSelectedEvent}/>}
            </div>
        </BaseLayout>
    );
}