import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md mt-2" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md mt-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
          </div>
        </div>
        
        <div className="bg-primary bg-opacity-5 p-4">
          <Skeleton className="h-5 w-32 rounded-md mb-3" />
          <div className="flex space-x-6">
            <Skeleton className="h-20 w-14 rounded-md" />
            <Skeleton className="h-20 w-14 rounded-md" />
            <Skeleton className="h-20 w-14 rounded-md" />
            <Skeleton className="h-20 w-14 rounded-md" />
            <Skeleton className="h-20 w-14 rounded-md" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="h-7 w-40 rounded-md mb-4" />
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
