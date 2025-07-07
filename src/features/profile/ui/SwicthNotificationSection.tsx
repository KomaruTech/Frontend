// src/features/profile/ui/SwitchNotificationSection.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Switch, Spinner, Divider } from '@heroui/react';
import { fetchNotificationPreferences, updateNotificationPreferences } from '@features/profile/api/notificationPreferencesApi';

interface SwitchNotificationSectionProps {
    triggerReloadWithAlert: (title: string, message: string, type: 'success' | 'error') => void;
}

const defaultPrefs = {
    notifyTelegram: false,
    notifyBeforeOneDay: false,
    notifyBeforeOneHour: false,
};

type PrefKey = keyof typeof defaultPrefs;

export const SwitchNotificationSection: React.FC<SwitchNotificationSectionProps> = ({ triggerReloadWithAlert }) => {
    const [preferences, setPreferences] = useState<Omit<typeof defaultPrefs, 'id'>>(defaultPrefs);
    const [savingStatus, setSavingStatus] = useState<Record<PrefKey, boolean>>({
        notifyTelegram: false,
        notifyBeforeOneDay: false,
        notifyBeforeOneHour: false,
    });

    useEffect(() => {
        fetchNotificationPreferences()
            .then(data => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...prefs } = data;
                setPreferences(prefs);
            })
            .catch(err => {
                triggerReloadWithAlert('Ошибка загрузки', err.message || 'Не удалось загрузить настройки', 'error');
            });
    }, [triggerReloadWithAlert]);

    const onToggle = useCallback((key: PrefKey, value: boolean) => {
        const updatedPrefs = { ...preferences, [key]: value };
        setPreferences(updatedPrefs);
        setSavingStatus(prev => ({ ...prev, [key]: true }));

        updateNotificationPreferences(updatedPrefs)
            .then(() => {
                triggerReloadWithAlert('Успех', 'Настройки уведомлений обновлены', 'success');
            })
            .catch(err => {
                triggerReloadWithAlert('Ошибка обновления', err.message || 'Ошибка при обновлении', 'error');
                // Откат назад, если нужно
                setPreferences(preferences);
            })
            .finally(() => {
                setSavingStatus(prev => ({ ...prev, [key]: false }));
            });
    }, [preferences, triggerReloadWithAlert]);

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Настройки уведомлений</h3>
            <div className="flex flex-col gap-4">
                {(['notifyTelegram', 'notifyBeforeOneDay', 'notifyBeforeOneHour'] as PrefKey[]).map((key) => (
                    <div key={key} className="flex items-center justify-between">
                        <Switch
                            isSelected={preferences[key]}
                            onValueChange={(val) => onToggle(key, val)}
                            disabled={savingStatus[key]}
                        >
                            {key === 'notifyTelegram' && 'Уведомления в Telegram'}
                            {key === 'notifyBeforeOneDay' && 'Напоминать за 1 день'}
                            {key === 'notifyBeforeOneHour' && 'Напоминать за 1 час'}
                        </Switch>
                        {savingStatus[key] && <Spinner size="sm" className="ml-2" />}
                    </div>
                ))}
            </div>
            <Divider className="my-8"/>
        </div>
    );
};
