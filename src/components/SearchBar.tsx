import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setInputValue("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search for a city"
      className="flex gap-2 w-full"
    >
      <label htmlFor="city-search" className="sr-only">
        Enter a city name
      </label>
      <Input
        id="city-search"
        type="search"
        name="city"
        placeholder="e.g. Stockholm, Paris, Tokyo…"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="words"
        spellCheck={false}
        aria-label="City name"
        disabled={disabled}
        className="flex-1 bg-background border-border placeholder:text-muted-foreground/70 placeholder:italic"
      />
      <Button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        aria-label="Search for weather in entered city"
        className="shrink-0"
      >
        <Search className="h-4 w-4 mr-2" aria-hidden="true" />
        <span>{disabled ? "Searching…" : "Search"}</span>
      </Button>
    </form>
  );
}
