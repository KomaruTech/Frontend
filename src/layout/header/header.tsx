import { Avatar, Input } from "@heroui/react";
import React from "react";

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

function Header() {
  return (
    <header className="fixed w-full h-[60px] top-0 left-0 z-50 bg-[rgb(0,78,158)] px-8 py-4 flex items-center justify-between text-white text-[18px]">
      <div className="text-xl font-involve font-bold">KomaruTech</div>

      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-8 text-sm font-medium">
          {/* Плашка поиска теперь стоит первой — слева от "Календарь" */}
          <div className="w-[250px]">
            <Input
              isClearable 
              color='primary'
              classNames={{
                label: "!text-white font-semibold",
                input: [
                  "bg-transparent",
                  "text-white",
                  "placeholder:text-white",
                  "font-involve",
                  "text-bold",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "h-[40px]",
                  "shadow-md",
                  "bg-white/20",
                  "dark:bg-white/30",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-white/30",
                  "dark:hover:bg-white/40",
                  "group-data-[focus=true]:bg-white/25",
                  "dark:group-data-[focus=true]:bg-white/35",
                  "!cursor-text",
                ],
              }}
              placeholder="Поиск..."
              radius="lg"
              startContent={
                <SearchIcon className="text-white mb-0.5 pointer-events-none flex-shrink-0" />
              }
            />
          </div>

          <a href="#" className="hover:text-blue-300 transition-colors font-involve text-[18px]">Календарь</a>
          <a href="#" className="hover:text-blue-300 transition-colors font-involve text-[18px]">Новости</a>
          <a href="#" className="hover:text-blue-300 text-[18px]">🔔</a>
        </nav>

        <Avatar name="Joe" />
      </div>
    </header>
  );
}

export default Header;
