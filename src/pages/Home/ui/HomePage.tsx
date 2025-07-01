// src/pages/home/ui/HomePage.tsx
import React from 'react';
// These imports are now cleaner and directly from the 'widgets' layer's public API
import { WelcomeCard } from "@widgets/WelcomeCard";
import { CustomCalendar } from "@widgets/CustomCalendar";
import { Header } from "@widgets/Header";
import OfferEventCar from './NewIvent';
import Main_menu from '@widgets/Header/ui/Main_menu';
import Invitation_to_event from '@/widgets/Invitation_to_event/ui/invitation_to_event'

const HomePage: React.FC = () => {
    return (
        <div className="flex bg-gray-100">
            <main className="flex-1 p-8 max-w-[1700px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Главная</h1>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* The order here might be adjusted based on your desired responsive layout */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 order-1 lg:order-2 items-end max-h-[600px]">
                        <Header />
                        <div className="flex flex-col gap-4 h-full min-w-[320px] mr-[19px]">
                            <OfferEventCar />
                            <CustomCalendar />
                        </div>
                            <Invitation_to_event />

                    </div>

                    <div className="w-full lg:w-2/3 order-2 lg:order-1 ml-[50px]">
                        <WelcomeCard />
                    </div>
                    <div>
                      <Main_menu />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default HomePage;