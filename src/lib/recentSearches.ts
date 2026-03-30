const STORAGE_KEY = "weather-recent-cities";
const MAX = 5;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(city: string): string[] {
  const updated = [
    city,
    ...getRecentSearches().filter((c) => c.toLowerCase() !== city.toLowerCase()),
  ].slice(0, MAX);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
