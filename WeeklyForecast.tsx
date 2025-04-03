import { Card, CardContent } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import { DailyForecast } from "@/lib/types";
import { formatTemp, formatForecastDate, formatPrecipitation } from "@/lib/weatherUtils";

interface WeeklyForecastProps {
  forecasts: DailyForecast[];
}

export function WeeklyForecast({ forecasts }: WeeklyForecastProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium text-neutral-800 mb-4">5-Day Forecast</h2>
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-0">
          {forecasts.map((day, index) => (
            <div 
              key={day.date}
              className={`p-4 ${index < forecasts.length - 1 ? 'border-b border-neutral-100' : ''} flex items-center justify-between`}
            >
              <div className="w-24">
                <p className="font-medium text-neutral-800">{day.dayName}</p>
                <p className="text-sm text-neutral-500">{formatForecastDate(day.date)}</p>
              </div>
              <div className="flex items-center">
                <img
                  src={day.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com')}
                  alt={day.condition.text}
                  className="w-10 h-10"
                />
                <span className="ml-2 text-neutral-500">{day.condition.text}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500 flex items-center">
                  <Droplets className="h-3 w-3 mr-1" />
                  <span>{formatPrecipitation(day.chanceOfRain)}</span>
                </span>
                <div>
                  <span className="font-medium text-neutral-800">{formatTemp(day.maxTemp)}</span>
                  <span className="text-neutral-500">/</span>
                  <span className="text-neutral-500">{formatTemp(day.minTemp)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
