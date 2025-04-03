import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermission({ onAllow, onDeny }: LocationPermissionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start">
        <MapPin className="text-primary text-3xl h-10 w-10 mr-4" />
        <div>
          <h2 className="text-xl font-medium text-neutral-800">Allow location access</h2>
          <p className="text-neutral-600 mt-1">
            WeatherNow needs access to your location to show you the most accurate weather data.
          </p>
          <div className="mt-4 flex space-x-3">
            <Button 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={onAllow}
            >
              Allow
            </Button>
            <Button 
              variant="outline"
              className="border border-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-100 transition-colors"
              onClick={onDeny}
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
