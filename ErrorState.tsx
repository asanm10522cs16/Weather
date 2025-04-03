import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { AppError } from "@/lib/types";

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
      <h2 className="text-xl font-medium text-neutral-800 mt-3">{error.title}</h2>
      <p className="text-neutral-600 mt-2">{error.message}</p>
      <Button 
        className="bg-primary text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
}
