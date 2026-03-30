const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE = "https://api.openweathermap.org";

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeedKph: number;
}

export interface ForecastDay {
  date: string; // "YYYY-MM-DD"
  low: number;
  high: number;
  description: string;
  icon: string;
}

export interface WeatherResult {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

async function geocode(
  city: string
): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const res = await fetch(
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Could not reach the weather service. Please try again.");
  const data = (await res.json()) as { lat: number; lon: number; name: string; country: string }[];
  if (data.length === 0)
    throw new Error(`City "${city}" not found. Check the spelling and try again.`);
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
}

async function fetchCurrent(
  lat: number,
  lon: number,
  name: string,
  country: string
): Promise<CurrentWeather> {
  const res = await fetch(
    `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Could not fetch current weather. Please try again.");
  const d = await res.json();
  return {
    city: name,
    country,
    temperature: Math.round(d.main.temp as number),
    feelsLike: Math.round(d.main.feels_like as number),
    description: d.weather[0].description as string,
    icon: d.weather[0].icon as string,
    humidity: d.main.humidity as number,
    windSpeedKph: Math.round((d.wind.speed as number) * 3.6),
  };
}

async function fetchForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const res = await fetch(
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Could not fetch the forecast. Please try again.");

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = data.list as any[];

  // Group 3-hour intervals by date, then derive daily high/low
  const seen = new Set<string>();
  const days: ForecastDay[] = [];

  for (const item of list) {
    const date = (item.dt_txt as string).split(" ")[0];
    if (seen.has(date)) continue;
    seen.add(date);

    const dayItems = list.filter((i) => (i.dt_txt as string).startsWith(date));
    const temps = dayItems.flatMap((i) => [i.main.temp_min as number, i.main.temp_max as number]);
    // Prefer the midday reading for the representative icon/description
    const midday =
      dayItems.find((i) => (i.dt_txt as string).includes("12:00:00")) ??
      dayItems[Math.floor(dayItems.length / 2)];

    days.push({
      date,
      low: Math.round(Math.min(...temps)),
      high: Math.round(Math.max(...temps)),
      description: midday.weather[0].description as string,
      icon: midday.weather[0].icon as string,
    });

    if (days.length === 5) break;
  }

  return days;
}

export async function fetchWeather(city: string): Promise<WeatherResult> {
  const { lat, lon, name, country } = await geocode(city);
  const [current, forecast] = await Promise.all([
    fetchCurrent(lat, lon, name, country),
    fetchForecast(lat, lon),
  ]);
  return { current, forecast };
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherResult> {
  const res = await fetch(
    `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Could not identify your location. Please search manually.");
  const data = (await res.json()) as { name: string; country: string }[];
  if (data.length === 0)
    throw new Error("No city found near your location. Please search manually.");

  const { name, country } = data[0];
  const [current, forecast] = await Promise.all([
    fetchCurrent(lat, lon, name, country),
    fetchForecast(lat, lon),
  ]);
  return { current, forecast };
}
