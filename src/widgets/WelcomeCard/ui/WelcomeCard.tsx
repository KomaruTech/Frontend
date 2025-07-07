import React from 'react';
import {useSelector} from 'react-redux';
import type {RootState} from '@app/store';
import WelcomeCardPattern from '@shared/assets/images/WelcomeCardPattern2.svg';

interface WelcomeCardProps {
    userName?: string | null;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({userName}) => {
    const storedUser = useSelector((state: RootState) => state.auth.user);
    const displayUserName = userName || storedUser?.name || 'Пользователь';

    return (
        <div
            className="
        w-full
        bg-white shadow-lg rounded-xl overflow-hidden
        h-[160px]
        flex flex-row items-stretch
      "
        >
            {/* Левая текстовая часть */}
            <div className="flex flex-col justify-center flex-grow basis-2/3 p-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">
                    Привет, {displayUserName}!
                </h2>
                <p className="text-gray-600 text-lg">
                    Рады видеть тебя снова 👋
                </p>
            </div>
            <img
                src={WelcomeCardPattern}
                alt="Декоративный узор"
                className="h-full w-auto object-contain"
            />
        </div>
    );
};
