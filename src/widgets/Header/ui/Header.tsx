import React from 'react';
import CustomUser from "@widgets/Header/ui/CustomUser.tsx";
// import Search from "@widgets/Header/ui/Search.tsx";
import Notification from "@widgets/Header/ui/Notification.tsx";
import SearchEvents from "@features/search";


export const Header: React.FC = () => {
    return (
        <header className="h-16 flex items-center justify-between w-full"> {/* Added w-full to ensure it takes full width of its parent */}
            <div className="flex items-center gap-4">
                {/* Potentially add logo or menu toggle here for larger screens */}
            </div>

            <div className="flex items-center gap-4">
                <SearchEvents/>
                <Notification/>
                <CustomUser/>
            </div>
        </header>
    );
};