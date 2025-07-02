// src/features/search/ui/SearchEvents.tsx
import  { useState, useCallback, useEffect, type ChangeEvent } from 'react';
import { Input, Spinner } from "@heroui/react";
import { SearchIcon } from "@shared/ui/icons/SearchIcon";
import { searchEvents, type Event, type SearchEventRequest } from '@features/search/api/searchApi';
import { useDebounce } from '@shared/lib/hooks/useDebounce';

export default function SearchEvents() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload: SearchEventRequest = {
                name: query.trim()
            };
            const results = await searchEvents(payload);
            setSearchResults(results);
        } catch (err: unknown) {
            const error = err as { message?: string };
            console.error("Error searching events:", err);
            setError(error.message || '\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u043f\u043e\u0438\u0441\u043a\u0435.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        performSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, performSearch]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchResults([]);
        setError(null);
    };

    return (
        <div className="relative w-full max-w-lg">
            <Input
                isClearable
                classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "bg-white",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-blue-50/50",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=true]:bg-default-200/50",
                        "dark:group-data-[focus=true]:bg-default/60",
                        "!cursor-text",
                    ],
                }}
                placeholder="Поиск мероприятий..."
                radius="lg"
                value={searchTerm}
                onChange={handleInputChange}
                onClear={handleClear}
                startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 z-10 rounded-lg">
                    <Spinner size="sm" />
                </div>
            )}

            {error && (
                <div className="mt-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md">
                    {error}
                </div>
            )}

            {searchResults.length > 0 && !isLoading && !error && (
                <div className="absolute mt-2 w-full bg-white dark:bg-default-50 shadow-lg rounded-lg max-h-60 overflow-y-auto z-20">
                    {searchResults.map(event => (
                        <div
                            key={event.id}
                            className="p-3 border-b border-gray-100 dark:border-default-100 hover:bg-gray-50 dark:hover:bg-default-100 cursor-pointer"
                        >
                            <h4 className="font-semibold text-gray-800 dark:text-white">{event.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {event.description || 'Нет описания'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(event.timeStart).toLocaleDateString()} - {new Date(event.timeEnd).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {searchTerm.trim() && searchResults.length === 0 && !isLoading && !error && (
                <div className="absolute mt-2 w-full bg-white dark:bg-default-50 shadow-lg rounded-lg p-3 text-center text-gray-500 dark:text-gray-400 z-20">
                    Ничего не найдено.
                </div>
            )}
        </div>
    );
}
