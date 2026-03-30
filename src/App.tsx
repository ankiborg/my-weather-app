import { useState } from "react";
import Header from "@/components/Header";
import CityDisplay from "@/components/CityDisplay";
import { fetchWeather, type WeatherResult } from "@/lib/weather";

type State =
  | { status: "idle" }
  | { status: "loading"; city: string }
  | { status: "success"; data: WeatherResult }
  | { status: "error"; message: string };

function App() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSearch(city: string) {
    setState({ status: "loading", city });
    try {
      const data = await fetchWeather(city);
      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      <Header onSearch={handleSearch} isLoading={state.status === "loading"} />

      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-8 sm:py-12"
      >
        {state.status === "idle" && (
          <div className="text-center py-16 text-muted-foreground" aria-live="polite">
            <p className="text-lg italic">Search for a city to see its weather…</p>
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
