import { useState, useCallback, useEffect, type ChangeEvent } from 'react';
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
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setSearchResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload: SearchEventRequest = {
                name: trimmedQuery,
                status: 'confirmed',
            };

            const results = await searchEvents(payload);
            const list = Array.isArray(results) ? results : [results];
            const filtered = list.filter(event => event.description && event.timeStart && event.timeEnd);
            setSearchResults(filtered);
        } catch (err: unknown) {
            console.error("Error searching events:", err);

            const errorMessage =
                err instanceof Error ? err.message : 'Произошла ошибка при поиске.';

            setError(errorMessage);
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
                placeholder="Поиск мероприятий по названию..."
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
                                {event.description!}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(event.timeStart).toLocaleString('ru-RU', {
                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })} – {new Date(event.timeEnd).toLocaleString('ru-RU', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
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
