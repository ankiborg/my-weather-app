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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Atmospheric gradient background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 20% -10%, oklch(0.55 0.20 270) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 80% 10%, oklch(0.45 0.22 250) 0%, transparent 55%),
            radial-gradient(ellipse 100% 100% at 50% 100%, oklch(0.25 0.15 230) 0%, transparent 70%),
            linear-gradient(160deg, oklch(0.28 0.18 270) 0%, oklch(0.18 0.12 255) 50%, oklch(0.12 0.08 240) 100%)
          `,
        }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white/20 focus:text-white focus:rounded-full focus:text-sm font-medium"
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
                <Button variant="default" onClick={handleGeolocate} className="gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Use my location
                </Button>
                <p className="text-sm text-white/60">
                  or search for any city above
                </p>
              </>
            )}
            {geoStatus === "denied" && (
              <p className="text-sm text-white/60">
                Location access was denied. Search for a city using the bar above.
              </p>
            )}
            {geoStatus === "unavailable" && (
              <p className="text-lg text-white/60">
                Search for a city to see its weather…
              </p>
            )}
          </div>
        )}

        {state.status === "loading" && (
          <div
            className="text-center py-16 text-white/70"
            aria-live="polite"
            aria-busy="true"
          >
            <p className="text-lg">Fetching weather for {state.city}…</p>
          </div>
        )}

        {state.status === "error" && (
          <div
            role="alert"
            className="rounded-2xl glass-subtle border border-red-400/40 px-5 py-4 text-red-200 text-sm sm:text-base"
          >
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 text-red-200/70">{state.message}</p>
          </div>
        )}

        {state.status === "success" && <CityDisplay data={state.data} />}
      </main>
    </div>
  );
}

export default App;
