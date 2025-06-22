
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CityWeather {
  name: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  lat: number;
  lon: number;
}
