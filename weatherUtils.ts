import { WeatherCondition } from "./types";

// Convert wind speed from km/h to mph
export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

// Convert visibility from km to miles
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

// Format temperature with degree symbol
export function formatTemp(temp: number, showUnit = true): string {
  return `${Math.round(temp)}${showUnit ? '°' : ''}`;
}

// Format precipitation chance as percentage
export function formatPrecipitation(chance: number): string {
  return `${chance}%`;
}

// Format wind speed with unit
export function formatWindSpeed(speed: number, metric = true): string {
  if (metric) {
    return `${Math.round(speed)} km/h`;
  }
  return `${Math.round(kmhToMph(speed))} mph`;
}

// Format visibility with unit
export function formatVisibility(visibility: number, metric = true): string {
  if (metric) {
    return `${visibility} km`;
  }
  return `${Math.round(kmToMiles(visibility))} mi`;
}

// Format pressure with unit
export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

// Get the current date formatted nicely
export function getCurrentDateFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

// Get human readable description of wind direction
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Determine if we should show hourly forecasts from current hour or start of day
export function getRelevantHourlyForecasts(hourlyForecasts: any[], count: number = 8): any[] {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Filter forecasts that are from current hour onwards
  const relevantForecasts = hourlyForecasts.filter(forecast => {
    const forecastHour = new Date(forecast.time).getHours();
    return forecastHour >= currentHour;
  });
  
  // If we have enough forecasts, return the requested count
  if (relevantForecasts.length >= count) {
    return relevantForecasts.slice(0, count);
  }
  
  // Otherwise, just return all we have
  return relevantForecasts;
}

// Get appropriate icon based on weather condition
export function getWeatherIcon(condition: WeatherCondition): string {
  // WeatherAPI icons are already URLs, so we just return them
  return condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com');
}

// Format date for display in forecast
export function formatForecastDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Get user's geolocation 
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
  });
}

// Check if location permission is granted
export function isLocationPermissionGranted(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.permissions) {
      // If Permissions API is not supported, we'll try to get location directly
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 1000 }
      );
      return;
    }
    
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      resolve(result.state === 'granted');
    }).catch(() => {
      resolve(false);
    });
  });
}
