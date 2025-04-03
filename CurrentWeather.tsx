import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Wind, Eye, Gauge } from "lucide-react";
import { CurrentWeather as CurrentWeatherType, Location } from "@/lib/types";
import { formatTemp, formatWindSpeed, formatVisibility, formatPressure, getCurrentDateFormatted } from "@/lib/weatherUtils";

interface CurrentWeatherProps {
  location: Location;
  weather: CurrentWeatherType;
}

export function CurrentWeather({ location, weather }: CurrentWeatherProps) {
  const currentDate = getCurrentDateFormatted();
  
  return (
    <div className="mb-8">
      <Card className="bg-white">
        <CardContent className="p-0">
          <div className="p-6">
            {/* Location info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-medium text-neutral-800">{location.name}</h2>
                <p className="text-neutral-500">{currentDate}</p>
              </div>
              <div className="flex items-center">
                <MapPin className="text-primary mr-1 h-4 w-4" />
                <span className="text-sm text-neutral-500">Current Location</span>
              </div>
            </div>
            
            {/* Main weather display */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={weather.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com')}
                  alt={weather.condition.text}
                  className="w-16 h-16"
                />
                <div className="ml-4">
                  <div className="text-5xl font-light text-neutral-800">{formatTemp(weather.temp)}</div>
                  <div className="text-neutral-500 capitalize">{weather.condition.text}</div>
                </div>
              </div>
              
              {/* Weather details */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex items-center">
                  <Droplets className="text-neutral-400 mr-2 h-4 w-4" />
                  <span>Humidity: <span className="font-medium">{weather.humidity}%</span></span>
                </div>
                <div className="flex items-center">
                  <Wind className="text-neutral-400 mr-2 h-4 w-4" />
                  <span>Wind: <span className="font-medium">{formatWindSpeed(weather.windSpeed)}</span></span>
                </div>
                <div className="flex items-center">
                  <Eye className="text-neutral-400 mr-2 h-4 w-4" />
                  <span>Visibility: <span className="font-medium">{formatVisibility(weather.visibility)}</span></span>
                </div>
                <div className="flex items-center">
                  <Gauge className="text-neutral-400 mr-2 h-4 w-4" />
                  <span>Pressure: <span className="font-medium">{formatPressure(weather.pressure)}</span></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}
