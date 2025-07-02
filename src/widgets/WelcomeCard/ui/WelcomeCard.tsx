// src/widgets/WelcomeCard/ui/WelcomeCard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';
import { Image } from '@heroui/react';

interface WelcomeCardProps {
    userName?: string | null;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
    const storedUser = useSelector((state: RootState) => state.auth.user);
    const displayUserName = userName || storedUser?.name || 'Пользователь';

    return (
        <div className="
      w-full max-w-[705px]
      bg-white
      shadow-lg rounded-xl overflow-hidden
      h-[160px]
      flex flex-row items-stretch
    ">
            <div className="flex flex-col justify-center flex-grow basis-2/3 p-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">
                    Привет, {displayUserName}!
                </h2>
                <p className="text-gray-600 text-lg">
                    Рады видеть тебя снова 👋
                </p>
            </div>
            <div className="relative flex-shrink-0 basis-1/3 hidden md:block">
                <Image
                    src="/images/WelcomeCardPattern.svg"
                    alt="Декоративный узор"
                    className="
                        absolute top-0 right-0
                        h-full w-auto object-cover
                    "
                />
            </div>
        </div>
    );
};