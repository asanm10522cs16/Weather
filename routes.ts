import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertWeatherSearchSchema, weatherResponseSchema, locationSearchSchema } from "@shared/schema";
import { z } from "zod";

// Get API key from environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

// In-memory cache for weather data to reduce API calls
const weatherCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get weather by coordinates
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon, units = "metric" } = req.query;

      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const cacheKey = `${lat},${lon}-${units}`;
      const cachedData = weatherCache.get(cacheKey);
      
      // Return cached data if it exists and is not expired
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return res.json(cachedData.data);
      }

      if (!WEATHER_API_KEY) {
        return res.status(500).json({ message: "Weather API key is not configured" });
      }

      // Get current weather and forecast from WeatherAPI
      const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: `${lat},${lon}`,
          days: 5,
          aqi: "no",
          alerts: "no",
        },
      });

      // Transform the API response to match our schema
      const transformedData = transformWeatherData(response.data);
      
      // Cache the response
      weatherCache.set(cacheKey, { 
        data: transformedData, 
        timestamp: Date.now() 
      });

      // Save search to history (without user for now)
      try {
        const location = response.data.location;
        await storage.saveWeatherSearch({
          query: location.name,
          lat: lat.toString(),
          lon: lon.toString(),
          userId: null
        });
      } catch (error) {
        // Don't fail the request if saving search history fails
        console.error("Failed to save search history:", error);
      }

      res.json(transformedData);
    } catch (error) {
      console.error("Weather API error:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json({ 
          message: "Error fetching weather data", 
          details: error.response.data 
        });
      }
      
      res.status(500).json({ message: "Error fetching weather data" });
    }
  });

  // Search locations by query string
  app.get("/api/locations/search", async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }

      if (!WEATHER_API_KEY) {
        return res.status(500).json({ message: "Weather API key is not configured" });
      }

      const response = await axios.get(`${WEATHER_API_BASE_URL}/search.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: q
        },
      });

      // Transform and validate the location data
      const locations = response.data.map((location: any) => ({
        id: location.id,
        name: location.name,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lon: location.lon
      }));

      // Validate with our schema
      const validatedLocations = z.array(locationSearchSchema).parse(locations);

      res.json(validatedLocations);
    } catch (error) {
      console.error("Location search error:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json({ 
          message: "Error searching locations", 
          details: error.response.data 
        });
      }
      
      res.status(500).json({ message: "Error searching locations" });
    }
  });

  // Get recent searches
  app.get("/api/searches/recent", async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const searches = await storage.getRecentSearches(Number(limit));
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving recent searches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to transform weather API data to our schema format
function transformWeatherData(apiData: any) {
  const { location, current, forecast } = apiData;

  // Transform forecast days data
  const forecastDays = forecast.forecastday.map((day: any) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Transform hourly data
    const hourly = day.hour.map((hour: any) => ({
      time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: hour.temp_c,
      condition: {
        text: hour.condition.text,
        icon: hour.condition.icon,
        code: hour.condition.code
      }
    }));

    return {
      date: day.date,
      dayName,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: {
        text: day.day.condition.text,
        icon: day.day.condition.icon,
        code: day.day.condition.code
      },
      chanceOfRain: day.day.daily_chance_of_rain,
      hourly
    };
  });

  return {
    location: {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    },
    current: {
      temp: current.temp_c,
      feelsLike: current.feelslike_c,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      windDirection: current.wind_degree,
      pressure: current.pressure_mb,
      visibility: current.vis_km,
      condition: {
        text: current.condition.text,
        icon: current.condition.icon,
        code: current.condition.code,
      },
      uv: current.uv,
      lastUpdated: current.last_updated,
    },
    forecast: forecastDays,
  };
}
