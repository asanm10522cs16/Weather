import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { useEffect, useRef } from "react";

interface WeatherMapProps {
  lat: number;
  lon: number;
}

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This would be replaced with actual map implementation
    // Examples could include:
    // - OpenLayers
    // - Leaflet
    // - Google Maps
    // But for now, we'll just show a placeholder with coordinates
  }, [lat, lon]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium text-neutral-800 mb-4">Weather Map</h2>
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-0">
          <div 
            ref={mapContainerRef}
            className="h-64 bg-neutral-100 flex items-center justify-center"
          >
            <div className="text-center">
              <Map className="h-12 w-12 text-neutral-400 mx-auto" />
              <p className="text-neutral-500 mt-2">
                Weather Map at {lat.toFixed(2)}, {lon.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                (Map functionality coming soon)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
