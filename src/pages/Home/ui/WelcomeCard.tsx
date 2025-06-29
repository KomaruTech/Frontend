import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';
import patternImage from '@shared/assets/images/WelcomeCardPattern.svg'; // Adjust the path as necessary

interface WelcomeCardProps {
    userName?: string | null;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
    const storedUser = useSelector((state: RootState) => state.auth.user);
    const displayUserName = userName || (storedUser ? storedUser.name : null) || 'Даниэль';

    return (
        <div className="flex items-center justify-start p-4">
            <div className="bg-blue-50 shadow-lg rounded-lg overflow-hidden flex flex-row items-stretch h-[85px]">
                <div className="flex flex-col justify-center p-4 flex-shrink-0 flex-grow">
                    <h2 className="text-lg font-bold mb-1 text-blue-800 leading-tight">
                        Привет, {displayUserName}!
                    </h2>
                    <p className="text-blue-600 text-sm">Рады видеть тебя снова.</p>
                </div>
                <div className="flex items-center justify-center p-2 bg-blue-100">
                    <img src={patternImage} alt="Pattern" className="h-full" />
                </div>
            </div>
        </div>
    );
};


// // src/pages/home/ui/WelcomeCard.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import type { RootState } from '@app/store'; // Импорт RootState для типизации
// import {Image} from '@heroui/react'

// interface WelcomeCardProps {
//     userName?: string | null;
// }

// export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
//     // Получаем объект пользователя из Redux-стора
//     const storedUser = useSelector((state: RootState) => state.auth.user);

//     // Определяем имя для отображения: сначала из пропсов, затем из Redux, затем дефолтное
//     const displayUserName = userName || (storedUser ? storedUser.name : null) || 'Пользователь';

//     return (
//         <div className="
//             w-full max-w-full
//             bg-white shadow-lg rounded-lg overflow-hidden relative
//             h-[180px] sm:h-[200px] md:h-[225px]
//             flex flex-row
//             items-stretch
//         ">
//             <div className="
//                 flex flex-col justify-center p-6 sm:p-8
//                 flex-shrink-0
//                 flex-grow
//                 basis-2/3
//                 relative z-10
//             ">
//                 <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 leading-tight">
//                     Привет, {displayUserName}!
//                 </h2>
//                 <p className="text-gray-600 text-base">Рады видеть тебя снова.</p>
//             </div>

//             <Image src='./' ></Image>
//         </div>
//     );
// };