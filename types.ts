// Types for the weather data on the frontend
export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  condition: WeatherCondition;
  uv: number;
  lastUpdated: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: WeatherCondition;
  chanceOfRain: number;
  hourly: HourlyForecast[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: DailyForecast[];
}

// Location search result
export interface LocationSearchResult {
  id: number;
  name: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
}

// Error state interface
export interface AppError {
  title: string;
  message: string;
}

// Application state interface
export type AppState = 
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'locationPrompt' }
  | { status: 'error', error: AppError }
  | { status: 'success', data: WeatherData };
