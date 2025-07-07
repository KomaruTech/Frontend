import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { useSelector } from "react-redux";
import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { CustomCalendar } from "@features/calendary";
import { Header } from "@widgets/Header";
import TabSwitcher from "@widgets/TabSwitcher";
import type { TabItem } from "@widgets/TabSwitcher/ui/TabSwitcher.tsx";
import TeamCard from "@features/createTeam/ui/TeamCard.tsx";
import { searchTeams, searchMyTeams, type ApiTeam } from "@features/createTeam/api/createTeamApi";
import type { RootState } from "@app/store";
import { Spinner } from "@heroui/react";
import CreateTeamCard from "@features/createTeam";

// Define the types for your tabs
type TabKey = "yourTeams" | "allTeams";

export default function TeamsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("yourTeams");
    const [displayedTeams, setDisplayedTeams] = useState<ApiTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id;
    const currentUserRole = currentUser?.role;

    const fetchTeamsForActiveTab = useCallback(async () => {
            setLoading(true);
            setError(null);
            try {
                let teamsData: ApiTeam[] = [];
                if (activeTab === "yourTeams") {
                    teamsData = await searchMyTeams();
                    console.log("TeamsPage: Fetched 'Your Teams':", teamsData);
                } else {
                    teamsData = await searchTeams();
                    console.log("TeamsPage: Fetched 'All Teams':", teamsData);
                }
                setDisplayedTeams(teamsData);
            } catch (err: unknown) {
                console.error("TeamsPage: Error loading teams:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Не удалось загрузить список команд.");
                }
            } finally {
                setLoading(false);
            }
        }, [activeTab]);

    useEffect(() => {
        fetchTeamsForActiveTab();
    }, [fetchTeamsForActiveTab]);

    const handleTeamDeleted = (teamId: string) => {
        setDisplayedTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    };

    const handleTeamUpdated = (updatedTeam: ApiTeam) => {
        setDisplayedTeams((prevTeams) =>
            prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        );
    };

    const handleTeamCreated = () => {
        fetchTeamsForActiveTab();
    };

    const tabOptions: TabItem<TabKey>[] = [
        { label: "Твои команды", value: "yourTeams" },
        { label: "Все команды", value: "allTeams" },
    ];

    return (
        <BaseLayout
            leftAside={<SidebarMenu />}
            rightAside={
                <>
                    <Header />
                    <OfferEventCar />
                    <CustomCalendar />
                </>
            }
        >
            <div className="flex items-center justify-between flex-wrap gap-4">
                <TabSwitcher<TabKey>
                    tabs={tabOptions}
                    activeTab={activeTab}
                    onTabChange={(value) => setActiveTab(value)}
                />
                <CreateTeamCard onCreateTeam={handleTeamCreated} />
            </div>

            <div>
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner size="lg" label="Загрузка команд..." />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center py-8">{error}</p>
                ) : displayedTeams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedTeams.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onTeamDeleted={handleTeamDeleted}
                                onTeamUpdated={handleTeamUpdated}
                                currentUserId={currentUserId || ""}
                                currentUserRole={currentUserRole || ""}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">
                        {activeTab === "yourTeams" ? "Вы пока не состоите ни в одной команде." : "Команды не найдены."}
                    </p>
                )}
            </div>
        </BaseLayout>
    );
}