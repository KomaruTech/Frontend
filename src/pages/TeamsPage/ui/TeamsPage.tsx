import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

// Widget imports (adjust paths as per your project)
import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx"; // Assuming this is your event offer component
import SidebarMenu from "@widgets/Header/ui/Main_menu"; // Assuming this is your sidebar menu
import { CustomCalendar } from "@features/calendary"; // Assuming this is your calendar component
import { Header } from "@widgets/Header"; // Assuming this is your header component
import TabSwitcher from "@widgets/TabSwitcher";
import type { TabItem } from "@widgets/TabSwitcher/ui/TabSwitcher.tsx";

// Feature-specific imports for teams (adjust paths as per your project)
import TeamCard from "@features/createTeam/ui/TeamCard.tsx"; // Component for displaying and managing a single team card
// ИМПОРТИРУЕМ ОБЕ ФУНКЦИИ ПОИСКА
import { searchTeams, searchMyTeams, type ApiTeam } from "@features/createTeam/api/createTeamApi"; // API functions for team operations

// Redux store type import
import type { RootState } from "@app/store"; // Import RootState for useSelector typing
import { Spinner } from "@heroui/react";
import CreateTeamCard from "@features/createTeam"; // Component for creating a team

// Define the types for your tabs
type TabKey = "yourTeams" | "allTeams";

/**
 * TeamsPage component displays and manages a list of teams.
 * It allows users to view their own teams, all teams, and create new teams.
 * Team management (delete, add/remove members) is handled within TeamCard,
 * with permissions based on the current user's ID and role.
 */
export default function TeamsPage() {
    // State for managing the active tab (Your Teams vs. All Teams)
    const [activeTab, setActiveTab] = useState<TabKey>("yourTeams");
    // State to store the teams displayed in the current tab
    const [displayedTeams, setDisplayedTeams] = useState<ApiTeam[]>([]); // ИЗМЕНЕНО: теперь это displayedTeams
    // Loading state for fetching the initial list of teams
    const [loading, setLoading] = useState(true);
    // Error state for fetching teams
    const [error, setError] = useState<string | null>(null);

    // Get the current user's ID and ROLE from the Redux store
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id;
    const currentUserRole = currentUser?.role;

    /**
     * Fetches teams based on the active tab.
     * This function is called on component mount and when the active tab changes.
     */
    const fetchTeamsForActiveTab = async () => { // ИЗМЕНЕНО: Новая функция для загрузки по вкладкам
        setLoading(true);
        setError(null);
        try {
            let teamsData: ApiTeam[] = [];
            if (activeTab === "yourTeams") {
                // Вызываем searchMyTeams для вкладки "Твои команды"
                teamsData = await searchMyTeams();
                console.log("TeamsPage: Fetched 'Your Teams':", teamsData);
            } else {
                // Вызываем searchTeams для вкладки "Все команды"
                teamsData = await searchTeams();
                console.log("TeamsPage: Fetched 'All Teams':", teamsData);
            }
            setDisplayedTeams(teamsData); // Обновляем отображаемые команды
        } catch (err: any) {
            console.error("TeamsPage: Error loading teams:", err);
            setError(err.message || "Не удалось загрузить список команд.");
        } finally {
            setLoading(false);
        }
    };

    // Effect hook to fetch teams when the component mounts OR when activeTab changes
    useEffect(() => {
        fetchTeamsForActiveTab();
    }, [activeTab]); // ДОБАВЛЕНО: activeTab в зависимости

    /**
     * Callback function for when a team is successfully deleted from TeamCard.
     * Updates the local state to remove the deleted team.
     * @param teamId The ID of the deleted team.
     */
    const handleTeamDeleted = (teamId: string) => {
        setDisplayedTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
        // addToast({ title: "Success", description: "Team deleted successfully.", color: "success" }); // Toast is handled in TeamCard
    };

    /**
     * Callback function for when a team's data (e.g., members list) is updated in TeamCard.
     * Updates the local state to reflect the changes in the specific team.
     * @param updatedTeam The updated Team object.
     */
    const handleTeamUpdated = (updatedTeam: ApiTeam) => {
        setDisplayedTeams((prevTeams) =>
            prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        );
        // addToast({ title: "Success", description: "Team updated successfully.", color: "success" }); // Toast is handled in TeamCard
    };

    /**
     * Callback function for when a new team is successfully created via CreateTeamCard.
     * Triggers a re-fetch of teams for the *current active tab* to include the newly created one.
     */
    const handleTeamCreated = () => {
        fetchTeamsForActiveTab(); // ИЗМЕНЕНО: Перезагружаем команды для текущей активной вкладки
    };

    // Configuration for the TabSwitcher component
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