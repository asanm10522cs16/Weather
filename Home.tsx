import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather } from '@/components/CurrentWeather';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { WeatherMap } from '@/components/WeatherMap';
import { LocationPermission } from '@/components/LocationPermission';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Cloud } from 'lucide-react';
import { AppState, LocationSearchResult } from '@/lib/types';
import { getUserLocation, isLocationPermissionGranted } from '@/lib/weatherUtils';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ status: 'initial' });
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Query for weather data based on coordinates
  const { data: weatherData, error, isLoading, isError, refetch } = useQuery({
    queryKey: [coordinates ? `/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}` : null],
    enabled: !!coordinates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Update app state based on query results
  useEffect(() => {
    if (isLoading) {
      setAppState({ status: 'loading' });
    } else if (isError) {
      setAppState({ 
        status: 'error',
        error: {
          title: 'Unable to fetch weather data',
          message: error instanceof Error ? error.message : 'Please check your internet connection and try again.'
        }
      });
    } else if (weatherData) {
      setAppState({ status: 'success', data: weatherData });
    }
  }, [isLoading, isError, weatherData, error]);

  // Check if the browser has location permission
  async function checkLocationPermission() {
    try {
      const hasPermission = await isLocationPermissionGranted();
      
      if (hasPermission) {
        getUserLocationAndFetchWeather();
      } else {
        setAppState({ status: 'locationPrompt' });
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setAppState({ status: 'locationPrompt' });
    }
  }

  // Get user's location and fetch weather
  async function getUserLocationAndFetchWeather() {
    setAppState({ status: 'loading' });
    
    try {
      const position = await getUserLocation();
      
      setCoordinates({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    } catch (error) {
      console.error('Error getting user location:', error);
      
      setAppState({
        status: 'error',
        error: {
          title: 'Location Error',
          message: 'Unable to get your location. Please allow location access or search for a location.'
        }
      });
    }
  }

  // Handle location selection from search
  function handleLocationSelect(location: LocationSearchResult) {
    setCoordinates({
      lat: location.lat,
      lon: location.lon
    });
  }

  // Handle retry after error
  function handleRetry() {
    if (coordinates) {
      refetch();
    } else {
      checkLocationPermission();
    }
  }

  // Handle location permission allow/deny
  function handleAllowLocation() {
    getUserLocationAndFetchWeather();
  }

  function handleDenyLocation() {
    // Set a default location if user denies
    setCoordinates({
      lat: 40.7128, // New York coordinates as fallback
      lon: -74.0060
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium text-neutral-800 flex items-center">
            <Cloud className="mr-2 text-primary h-8 w-8" />
            WeatherNow
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Search */}
      <SearchBar onSelectLocation={handleLocationSelect} />

      {/* App State Rendering */}
      {appState.status === 'loading' && <LoadingState />}
      
      {appState.status === 'locationPrompt' && (
        <LocationPermission 
          onAllow={handleAllowLocation} 
          onDeny={handleDenyLocation}
        />
      )}
      
      {appState.status === 'error' && (
        <ErrorState 
          error={appState.error} 
          onRetry={handleRetry} 
        />
      )}
      
      {appState.status === 'success' && (
        <>
          {/* Current Weather */}
          <CurrentWeather 
            location={appState.data.location} 
            weather={appState.data.current} 
          />
          
          {/* Hourly Forecast */}
          {appState.data.forecast[0]?.hourly && (
            <HourlyForecast 
              forecasts={appState.data.forecast[0].hourly} 
            />
          )}
          
          {/* Weekly Forecast */}
          <WeeklyForecast forecasts={appState.data.forecast} />
          
          {/* Weather Map */}
          <WeatherMap 
            lat={appState.data.location.lat} 
            lon={appState.data.location.lon} 
          />
        </>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-neutral-500 text-sm">
        <p>WeatherNow © {new Date().getFullYear()} - Powered by WeatherAPI</p>
        <div className="flex justify-center mt-2 space-x-4">
          <a href="#" className="hover:text-primary">About</a>
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
        </div>
      </footer>
    </div>
  );
}
