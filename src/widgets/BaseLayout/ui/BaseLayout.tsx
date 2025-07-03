// src/shared/ui/BaseLayout.tsx
import React from "react";

interface BaseLayoutProps {
    leftAside?: React.ReactNode;
    rightAside?: React.ReactNode;
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
                                                   leftAside,
                                                   rightAside,
                                                   children,
                                               }) => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <main className="flex-1 p-8 mx-auto w-full max-w-[1920px] min-h-screen">
                <div className="flex flex-col lg:flex-row gap-6 min-h-screen items-start">

                    {/* Sidebar */}
                    {leftAside && (
                        <div className="order-1 lg:order-1">
                            {leftAside}
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-6 order-2 lg:order-2">
                        {children}
                    </div>

                    {/* Right Column: Header + Button + Calendar */}
                    {rightAside && (
                        <div className="w-full lg:w-[350px] flex flex-col gap-4 order-3 items-end">
                            {rightAside}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BaseLayout;
