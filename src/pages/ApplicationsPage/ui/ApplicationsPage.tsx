// src/pages/ApplicationPage/ui/ApplicationPage.tsx
import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import { CustomCalendar } from "@features/calendary";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";
import React from "react";
import {EventModerationList} from "@features/applications";


const ApplicationPage: React.FC = () => {
    return (
        <BaseLayout
            leftAside={<SidebarMenu/>}
            rightAside={<>
                <Header/>
                <OfferEventCar/>
                <CustomCalendar/>
            </>} >
            <EventModerationList />
        </BaseLayout>
    );
};

export default ApplicationPage;
