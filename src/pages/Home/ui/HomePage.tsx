// src/pages/home/ui/HomePage.tsx
import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {WelcomeCard} from "@widgets/WelcomeCard";
import {CustomCalendar} from "@features/calendary";
import {Header} from "@widgets/Header";
import OfferEventCar from '@features/post-event/ui/NewIvent.tsx';
import SidebarMenu from '@widgets/Header/ui/Main_menu';
import InvitationToEvent from '@widgets/Invitation_to_event/ui/InvitationToEvent.tsx'
import StatisticsCard from '@/features/statistics';

import {
    fetchProfilePending,
    fetchProfileSuccess,
    fetchProfileFailure
} from '@features/profile/model/profileSlice';
import {fetchMyProfile} from '@features/profile/api/profileApi';
import {setUserProfileData} from '@features/auth/model/authSlice';
import type {RootState} from '@app/store';

const HomePage: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);

    const hasFetchedProfile = useRef(false);

    useEffect(() => {
        if (authUser?.id && !hasFetchedProfile.current) {
            hasFetchedProfile.current = true;
            dispatch(fetchProfilePending());
            fetchMyProfile(authUser.id)
                .then(data => {
                    dispatch(fetchProfileSuccess(data));
                    dispatch(setUserProfileData({...authUser, ...data}));
                })
                .catch(err => {
                    const msg = err instanceof Error
                        ? err.message
                        : 'Неизвестная ошибка при загрузке профиля на главной странице';
                    dispatch(fetchProfileFailure(msg));
                    console.error("Ошибка при загрузке профиля на главной странице:", msg);
                });
        }
    }, [dispatch, authUser?.id]);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <main className="flex-1 p-8 mx-auto w-full max-w-[1920px] min-h-screen">
                <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 order-1 lg:order-2 items-end max-h-[600px]">
                        <Header/>
                        <div className="flex flex-col gap-4 h-full min-w-[320px] mr-[19px]">
                            <OfferEventCar/>
                            <CustomCalendar/>
                        </div>
                        <InvitationToEvent/>
                    </div>
                    <div className="w-full lg:w-2/3 order-2 lg:order-1">
                        <WelcomeCard/>
                        <StatisticsCard />
                    </div>
                    <SidebarMenu/>
                </div>
            </main>
        </div>
    );
};

export default HomePage;