import { weatherSearches, type WeatherSearch, type InsertWeatherSearch, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather search history methods
  saveWeatherSearch(search: InsertWeatherSearch): Promise<WeatherSearch>;
  getRecentSearches(limit?: number): Promise<WeatherSearch[]>;
  getSearchesByUser(userId: number, limit?: number): Promise<WeatherSearch[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private weatherSearches: Map<number, WeatherSearch>;
  private userIdCounter: number;
  private searchIdCounter: number;

  constructor() {
    this.users = new Map();
    this.weatherSearches = new Map();
    this.userIdCounter = 1;
    this.searchIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveWeatherSearch(search: InsertWeatherSearch): Promise<WeatherSearch> {
    const id = this.searchIdCounter++;
    const timestamp = new Date();
    const weatherSearch: WeatherSearch = { 
      ...search, 
      id, 
      timestamp 
    };
    this.weatherSearches.set(id, weatherSearch);
    return weatherSearch;
  }

  async getRecentSearches(limit: number = 10): Promise<WeatherSearch[]> {
    return Array.from(this.weatherSearches.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getSearchesByUser(userId: number, limit: number = 10): Promise<WeatherSearch[]> {
    return Array.from(this.weatherSearches.values())
      .filter(search => search.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
