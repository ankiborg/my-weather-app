import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Wind, Sunrise, Sunset } from "lucide-react";
import type { WeatherResult } from "@/lib/weather";

interface CityDisplayProps {
  data: WeatherResult;
}

function owmIconUrl(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(year, month - 1, day)
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CityDisplay({ data }: CityDisplayProps) {
  const { current, forecast } = data;

  return (
    <section aria-live="polite" aria-label={`Weather for ${current.city}`} className="space-y-4">
      {/* Current conditions */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            {current.city}
            <span className="text-base font-normal text-muted-foreground">
              {current.country}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Temperature + icon row */}
          <div className="flex items-center gap-2">
            <img
              src={owmIconUrl(current.icon)}
              alt={current.description}
              width={80}
              height={80}
              className="-ml-2 -my-2"
            />
            <div>
              <p className="text-6xl font-bold text-foreground leading-none">
                {current.temperature}°C
              </p>
              <p className="text-muted-foreground mt-1 italic">
                {capitalize(current.description)}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-primary" aria-hidden="true" />
              Humidity: <strong className="text-foreground">{current.humidity}%</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
              Wind: <strong className="text-foreground">{current.windSpeedKph} km/h</strong>
            </span>
            <span className="text-muted-foreground">
              Feels like: <strong className="text-foreground">{current.feelsLike}°C</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Sunrise className="h-4 w-4 text-primary" aria-hidden="true" />
              <strong className="text-foreground">
                {new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Sunset className="h-4 w-4 text-primary" aria-hidden="true" />
              <strong className="text-foreground">
                {new Date(current.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 5-day forecast */}
      {forecast.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            5-Day Forecast
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day) => (
              <Card key={day.date} className="shadow-sm text-center">
                <CardContent className="px-2 py-3 flex flex-col items-center gap-0.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    {formatDay(day.date)}
                  </p>
                  <img
                    src={owmIconUrl(day.icon)}
                    alt={day.description}
                    width={48}
                    height={48}
                    className="-my-1"
                  />
                  <p className="text-sm font-bold text-foreground">{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
