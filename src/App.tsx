import { useState } from "react";
import Header from "@/components/Header";
import CityDisplay from "@/components/CityDisplay";

function App() {
  const [searchedCity, setSearchedCity] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      <Header onSearch={setSearchedCity} />

      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-8 sm:py-12"
      >
        {searchedCity ? (
          <CityDisplay cityName={searchedCity} />
        ) : (
          <div className="text-center py-16 text-muted-foreground" aria-live="polite">
            <p className="text-lg italic">
              Search for a city to see its weather…
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
