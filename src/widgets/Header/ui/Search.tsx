import {Input} from "@heroui/react";
import {SearchIcon} from "@shared/ui/icons/SearchIcon.tsx";


export default function Search() {
    return (
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
            placeholder="Поиск..."
            radius="lg"
            startContent={
                <SearchIcon
                    className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"/>
            }
        />
    );
}