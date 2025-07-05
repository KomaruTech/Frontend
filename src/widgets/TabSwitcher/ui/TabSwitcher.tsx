export interface TabItem<T extends string> {
    label: string;
    value: T;
}

interface TabSwitcherProps<T extends string> {
    tabs: TabItem<T>[];
    activeTab: T;
    onTabChange: (value: T) => void;
}

function TabSwitcher<T extends string>({
                                           tabs,
                                           activeTab,
                                           onTabChange,
                                       }: TabSwitcherProps<T>) {
    return (
        <div className="flex bg-gray-200 rounded-full p-1 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        activeTab === tab.value
                            ? "bg-gradient-to-r from-blue-600 to-blue-300 text-white"
                            : "text-gray-600 hover:text-black"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default TabSwitcher;
