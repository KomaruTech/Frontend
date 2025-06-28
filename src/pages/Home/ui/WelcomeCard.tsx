// src/pages/home/ui/WelcomeCard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store'; // Импорт RootState для типизации
import {Image} from '@heroui/react'

interface WelcomeCardProps {
    userName?: string | null;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
    // Получаем объект пользователя из Redux-стора
    const storedUser = useSelector((state: RootState) => state.auth.user);

    // Определяем имя для отображения: сначала из пропсов, затем из Redux, затем дефолтное
    const displayUserName = userName || (storedUser ? storedUser.name : null) || 'Пользователь';

    return (
        <div className="
            w-full max-w-full
            bg-white shadow-lg rounded-lg overflow-hidden relative
            h-[180px] sm:h-[200px] md:h-[225px]
            flex flex-row
            items-stretch
        ">
            <div className="
                flex flex-col justify-center p-6 sm:p-8
                flex-shrink-0
                flex-grow
                basis-2/3
                relative z-10
            ">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 leading-tight">
                    Привет, {displayUserName}!
                </h2>
                <p className="text-gray-600 text-base">Рады видеть тебя снова.</p>
            </div>

            <Image src='./' ></Image>
        </div>
    );
};