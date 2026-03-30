import { useState } from "react";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import CityDisplay from "@/components/CityDisplay";
import { Button } from "@/components/ui/button";
import { fetchWeather, fetchWeatherByCoords, type WeatherResult } from "@/lib/weather";
import { getRecentSearches, addRecentSearch } from "@/lib/recentSearches";

type WeatherState =
  | { status: "idle" }
  | { status: "loading"; city: string }
  | { status: "success"; data: WeatherResult }
  | { status: "error"; message: string };

// "idle"      — not yet attempted
// "denied"    — user declined the browser permission prompt
// "unavailable" — browser doesn't support geolocation
type GeoStatus = "idle" | "denied" | "unavailable";

function App() {
  const [state, setState] = useState<WeatherState>({ status: "idle" });
  const [recentCities, setRecentCities] = useState<string[]>(() => getRecentSearches());
  const [geoStatus, setGeoStatus] = useState<GeoStatus>(() =>
    navigator.geolocation ? "idle" : "unavailable"
  );

  async function handleSearch(city: string) {
    setState({ status: "loading", city });
    try {
      const data = await fetchWeather(city);
      // Persist the API-resolved name (e.g. "Stockholm") not the raw input
      setRecentCities(addRecentSearch(data.current.city));
      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  function handleGeolocate() {
    setState({ status: "loading", city: "your location" });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setRecentCities(addRecentSearch(data.current.city));
          setState({ status: "success", data });
        } catch (err) {
          setState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Could not fetch weather for your location.",
          });
        }
      },
      () => {
        // User denied or browser blocked location access
        setGeoStatus("denied");
        setState({ status: "idle" });
      }
    );
  }

  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      <Header onSearch={handleSearch} isLoading={isLoading} recentCities={recentCities} />

      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-8 sm:py-12"
      >
        {state.status === "idle" && (
          <div className="text-center py-12 space-y-3" aria-live="polite">
            {geoStatus === "idle" && (
              <>
                <Button variant="outline" onClick={handleGeolocate} className="gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Use my location
                </Button>
                <p className="text-sm text-muted-foreground">
                  or search for any city above
                </p>
              </>
            )}
            {geoStatus === "denied" && (
              <p className="text-sm text-muted-foreground italic">
                Location access was denied. Search for a city using the bar above.
              </p>
            )}
            {geoStatus === "unavailable" && (
              <p className="text-lg italic text-muted-foreground">
                Search for a city to see its weather…
              </p>
            )}
          </div>
        )}

        {state.status === "loading" && (
          <div
            className="text-center py-16 text-muted-foreground"
            aria-live="polite"
            aria-busy="true"
          >
            <p className="text-lg italic">Fetching weather for {state.city}…</p>
          </div>
        )}

        {state.status === "error" && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 text-destructive text-sm sm:text-base"
          >
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 text-destructive/80">{state.message}</p>
          </div>
        )}

        {state.status === "success" && <CityDisplay data={state.data} />}
      </main>
    </div>
  );
}

export default App;
