import SearchBar from "@/components/SearchBar";
import RecentSearches from "@/components/RecentSearches";

interface HeaderProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  recentCities: string[];
}

export default function Header({ onSearch, isLoading, recentCities }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-surface" role="banner">
      <div className="container mx-auto max-w-3xl px-4 py-5 sm:py-6">
        <div className="mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Annikas Weather App
          </h1>
          <p className="text-sm text-white/55 mt-1">
            Your window to the weather outside
          </p>
        </div>
        <SearchBar onSearch={onSearch} disabled={isLoading} />
        <RecentSearches cities={recentCities} onSelect={onSearch} disabled={isLoading} />
      </div>
    </header>
  );
}
