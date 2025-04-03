import { Card, CardContent } from "@/components/ui/card";
import { HourlyForecast as HourlyForecastType } from "@/lib/types";
import { formatTemp, getRelevantHourlyForecasts } from "@/lib/weatherUtils";

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
}

export function HourlyForecast({ forecasts }: HourlyForecastProps) {
  // Get the relevant forecasts for display (from current hour onwards)
  const displayForecasts = getRelevantHourlyForecasts(forecasts, 8);
  
  // If first item is current hour, change label to "Now"
  if (displayForecasts.length > 0) {
    const firstForecast = { ...displayForecasts[0] };
    const currentHour = new Date().getHours();
    const forecastHour = new Date(firstForecast.time).getHours();
    
    if (currentHour === forecastHour) {
      firstForecast.time = "Now";
      displayForecasts[0] = firstForecast;
    }
  }

  return (
    <div className="bg-primary bg-opacity-5 p-4 overflow-x-auto rounded-b-lg">
      <h3 className="text-sm font-medium text-neutral-700 mb-3">HOURLY FORECAST</h3>
      <div className="flex space-x-6">
        {displayForecasts.map((hour, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="text-sm text-neutral-700">{hour.time}</p>
            <img
              src={hour.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com')}
              alt={hour.condition.text}
              className="w-10 h-10 my-1"
            />
            <p className="text-sm font-medium text-neutral-700">{formatTemp(hour.temp)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
