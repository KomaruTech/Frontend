// src/pages/home/ui/HomePage.tsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import { WelcomeCard } from "@widgets/WelcomeCard";
import { CustomCalendar } from "@features/calendary";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
// import InvitationToEvent from "@widgets/Invitation_to_event/ui/InvitationToEvent.tsx";
import StatisticsCard from "@/features/statistics";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";

import {
    fetchProfilePending,
    fetchProfileSuccess,
    fetchProfileFailure,
} from "@features/profile/model/profileSlice";
import { fetchMyProfile } from "@features/profile/api/profileApi";
import { setUserProfileData } from "@features/auth/model/authSlice";
import type { RootState } from "@app/store";
import CreateTeamModal from "@/features/createTeam";

const HomePage: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const hasFetchedProfile = useRef(false);

    useEffect(() => {
        if (authUser?.id && !hasFetchedProfile.current) {
            hasFetchedProfile.current = true;
            dispatch(fetchProfilePending());
            fetchMyProfile(authUser.id)
                .then((data) => {
                    dispatch(fetchProfileSuccess(data));
                    dispatch(setUserProfileData({ ...authUser, ...data }));
                })
                .catch((err) => {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Неизвестная ошибка при загрузке профиля на главной странице";
                    dispatch(fetchProfileFailure(msg));
                    console.error("Ошибка при загрузке профиля на главной странице:", msg);
                });
        }
    }, [dispatch, authUser?.id]);

    return (
        <BaseLayout
            leftAside={<SidebarMenu />}
            rightAside={
                <>
                    <Header />
                    <OfferEventCar />
                    <CustomCalendar />
                    <CreateTeamModal />
                </>
            }
        >
            {/* Центр: контент */}
            <WelcomeCard />
            <StatisticsCard />
        </BaseLayout>
    );
};

export default HomePage;
