import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table remains the same for auth purposes if needed later
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Weather search history table
export const weatherSearches = pgTable("weather_searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeatherSearchSchema = createInsertSchema(weatherSearches).pick({
  query: true,
  lat: true,
  lon: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWeatherSearch = z.infer<typeof insertWeatherSearchSchema>;
export type WeatherSearch = typeof weatherSearches.$inferSelect;

// Weather API types - not stored in DB but used for API responses
export const weatherResponseSchema = z.object({
  location: z.object({
    name: z.string(),
    country: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  current: z.object({
    temp: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windDirection: z.number(),
    pressure: z.number(),
    visibility: z.number(),
    condition: z.object({
      text: z.string(),
      icon: z.string(),
      code: z.number(),
    }),
    uv: z.number(),
    lastUpdated: z.string(),
  }),
  forecast: z.array(
    z.object({
      date: z.string(),
      dayName: z.string(),
      maxTemp: z.number(),
      minTemp: z.number(),
      condition: z.object({
        text: z.string(),
        icon: z.string(),
        code: z.number(),
      }),
      chanceOfRain: z.number(),
      hourly: z.array(
        z.object({
          time: z.string(),
          temp: z.number(),
          condition: z.object({
            text: z.string(),
            icon: z.string(),
            code: z.number(),
          }),
        })
      ),
    })
  ),
});

export const locationSearchSchema = z.object({
  id: z.number(),
  name: z.string(),
  region: z.string().optional(),
  country: z.string(),
  lat: z.number(),
  lon: z.number(),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type LocationSearch = z.infer<typeof locationSearchSchema>;
