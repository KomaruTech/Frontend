// src/pages/ApplicationPage/ui/ApplicationPage.tsx
import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import { CustomCalendar } from "@features/calendary";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import InvitationToEvent from "@widgets/Invitation_to_event/ui/InvitationToEvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";
import React from "react";


const ApplicationPage: React.FC = () => {
    return (
        <BaseLayout
            leftAside={<SidebarMenu/>}
            rightAside={<>
                <Header/>
                <OfferEventCar/>
                <CustomCalendar/>
                <InvitationToEvent/>
            </>} children={undefined}>
        </BaseLayout>
    );
};

export default ApplicationPage;
