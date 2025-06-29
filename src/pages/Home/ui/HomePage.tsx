// src/pages/home/ui/HomePage.tsx
import React from 'react';
import { WelcomeCard } from './WelcomeCard'; // Компонент, специфичный для этой страницы
import OfferEventCar from './NewIvent';

const HomePage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-1 p-8 ml-64">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Обзор</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <WelcomeCard />

                </div>
                <div className="absolute top-20 right-20">

                    <OfferEventCar />

                </div>

            </main>
        </div>
    );
};

export default HomePage;