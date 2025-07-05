// src/widgets/Header/ui/Header.tsx
import React from 'react';
import CustomUser from "@widgets/Header/ui/CustomUser.tsx";
import SearchEvents from "@features/search";

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="flex-1 max-w-xl">
                    <SearchEvents />
                </div>
                <CustomUser />
            </div>
        </header>
    );
};
