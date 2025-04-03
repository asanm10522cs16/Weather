import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LocationSearchResult } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  onSelectLocation: (location: LocationSearchResult) => void;
}

export function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 500);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search for locations when query changes
  useEffect(() => {
    const searchLocations = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(debouncedQuery)}`);
        
        if (!response.ok) {
          throw new Error('Failed to search locations');
        }
        
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectSuggestion = (suggestion: LocationSearchResult) => {
    onSelectLocation(suggestion);
    setQuery(suggestion.name);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  return (
    <div className="mb-6 relative">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-3 text-neutral-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            className="w-full py-3 px-2 outline-none border-none text-neutral-700 focus:ring-0"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(!!suggestions.length)}
          />
          <Button 
            type="submit"
            className="bg-primary text-white p-3 h-full rounded-none hover:bg-blue-600 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-1 p-0"
        >
          {isLoading ? (
            <div className="p-3 text-neutral-500">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div 
                key={`${suggestion.id}-${suggestion.name}`}
                className="p-3 hover:bg-neutral-100 cursor-pointer flex items-center"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <MapPin className="mr-2 h-4 w-4 text-neutral-400" />
                <span>
                  {suggestion.name}
                  {suggestion.region ? `, ${suggestion.region}` : ''} ({suggestion.country})
                </span>
              </div>
            ))
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-3 text-neutral-500">No locations found</div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
