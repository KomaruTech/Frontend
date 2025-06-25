import { Input } from "@heroui/react";
import "./styles.css";

export const SearchIcon = (props) => {
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

function Search() {
  return (
    <div className="fixed top-20 right-6 z-50 w-fit rounded-2xl bg-gradient-to-tr from-[rgb(0,78,158)] to-[rgb(0,100,200)] text-white shadow-lg">
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
            "shadow-xl",
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
        label="Search"
        placeholder="Type to search..."
        radius="lg"
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />
    </div>
  );
}

export default Search;