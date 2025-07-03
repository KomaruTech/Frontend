import React, { useEffect, useState } from 'react';

interface Application {
    id: string;
    applicantName: string;
    email: string;
    status: 'new' | 'in_progress' | 'done';
    submittedAt: string;
}

const ApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Пример загрузки данных (замени на реальный API-запрос)
    useEffect(() => {
        async function fetchApplications() {
            try {
                setLoading(true);
                setError(null);
                // Симуляция API запроса
                const data: Application[] = [
                    { id: '1', applicantName: 'Иван Иванов', email: 'ivan@example.com', status: 'new', submittedAt: '2025-07-01' },
                    { id: '2', applicantName: 'Мария Петрова', email: 'maria@example.com', status: 'in_progress', submittedAt: '2025-07-02' },
                    { id: '3', applicantName: 'Алексей Смирнов', email: 'alex@example.com', status: 'done', submittedAt: '2025-06-28' },
                ];
                // эмулируем задержку
                await new Promise((r) => setTimeout(r, 500));
                setApplications(data);
            } catch (e) {
                setError('Ошибка при загрузке заявок');
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, []);

    if (loading) return <div>Загрузка заявок...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Заявки</h1>
            {applications.length === 0 ? (
                <p>Заявок пока нет.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Имя</th>
                        <th className="border border-gray-300 p-2 text-left">Email</th>
                        <th className="border border-gray-300 p-2 text-left">Статус</th>
                        <th className="border border-gray-300 p-2 text-left">Дата подачи</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(({ id, applicantName, email, status, submittedAt }) => (
                        <tr key={id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{applicantName}</td>
                            <td className="border border-gray-300 p-2">{email}</td>
                            <td className="border border-gray-300 p-2 capitalize">{status.replace('_', ' ')}</td>
                            <td className="border border-gray-300 p-2">{submittedAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ApplicationsPage;