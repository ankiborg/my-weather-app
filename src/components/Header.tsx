import SearchBar from "@/components/SearchBar";
import RecentSearches from "@/components/RecentSearches";

interface HeaderProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  recentCities: string[];
}

export default function Header({ onSearch, isLoading, recentCities }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm" role="banner">
      <div className="container mx-auto max-w-3xl px-4 py-5 sm:py-6">
        <div className="mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            Annikas Weather App
          </h1>
          <p className="text-sm text-muted-foreground mt-1 italic">
            Your cozy window to the weather outside
          </p>
        </div>
        <SearchBar onSearch={onSearch} disabled={isLoading} />
        <RecentSearches cities={recentCities} onSelect={onSearch} disabled={isLoading} />
      </div>
    </header>
  );
}
