import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface RecentSearchesProps {
  cities: string[];
  onSelect: (city: string) => void;
  disabled?: boolean;
}

export default function RecentSearches({ cities, onSelect, disabled }: RecentSearchesProps) {
  if (cities.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-xs text-muted-foreground select-none">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Recent:
      </span>
      {cities.map((city) => (
        <Button
          key={city}
          variant="outline"
          size="sm"
          onClick={() => onSelect(city)}
          disabled={disabled}
          className="h-7 text-xs px-2.5"
          aria-label={`Search weather for ${city}`}
        >
          {city}
        </Button>
      ))}
    </div>
  );
}
