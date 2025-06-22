
import { API_KEY, BASE_URL, POPULAR_CITIES } from './config';
import { mapWeatherIcon, makeApiRequest } from './utils';
import { WeatherData, ForecastDay, HourlyForecast, City, CityWeather } from './types';

// Get current weather by coordinates
export const getCurrentWeather = async (lat: number, lon: number, preferredLocation?: string): Promise<WeatherData> => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await makeApiRequest(url);
  
  return {
    location: preferredLocation || `${data.name}, ${data.sys.country}`,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    visibility: Math.round(data.visibility / 1000), // Convert m to km
    icon: mapWeatherIcon(data.weather[0].icon)
  };
};

// Get 5-day forecast
export const getForecast = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await makeApiRequest(url);
  
  // Group forecasts by day and get daily highs/lows
  const dailyForecasts: { [key: string]: any[] } = {};
  
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!dailyForecasts[dayKey]) {
      dailyForecasts[dayKey] = [];
    }
    dailyForecasts[dayKey].push(item);
  });
  
  // Convert to our format
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
  const forecast: ForecastDay[] = [];
  
  Object.entries(dailyForecasts).slice(0, 5).forEach(([date, items], index) => {
    const temps = items.map(item => item.main.temp);
    const high = Math.round(Math.max(...temps));
    const low = Math.round(Math.min(...temps));
    
    // Use the most common weather condition for the day
    const conditions = items.map(item => mapWeatherIcon(item.weather[0].icon));
    const condition = conditions[0]; // Simplified - use first condition
    
    forecast.push({
      day: days[index] || new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      high,
      low,
      condition
    });
  });
  
  return forecast;
};

// Get 24-hour hourly forecast
export const getHourlyForecast = async (lat: number, lon: number): Promise<HourlyForecast[]> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await makeApiRequest(url);
  
  // Get next 24 hours (8 data points * 3 hours each = 24 hours)
  const hourlyData: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString('en', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return {
      time,
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: mapWeatherIcon(item.weather[0].icon)
    };
  });
  
  return hourlyData;
};

// Search cities by name using OpenWeatherMap Geocoding API
export const searchCities = async (query: string): Promise<City[]> => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const data = await makeApiRequest(url);
  
  return data.map((city: any) => ({
    name: city.name,
    country: city.country,
    lat: city.lat,
    lon: city.lon
  }));
};

// Search cities by weather type
export const searchCitiesByWeatherType = async (weatherType: string): Promise<CityWeather[]> => {
  // Fetch weather for all cities
  const weatherPromises = POPULAR_CITIES.map(async (city) => {
    try {
      const url = `${BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`;
      const data = await makeApiRequest(url);
      const condition = mapWeatherIcon(data.weather[0].icon);
      
      return {
        name: city.name, // Use predefined city name
        country: city.country, // Use predefined country code
        temperature: Math.round(data.main.temp),
        condition,
        icon: condition,
        lat: city.lat,
        lon: city.lon
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city.name}:`, error);
      return null;
    }
  });

  const weatherResults = await Promise.all(weatherPromises);
  
  // Filter cities by weather type and remove null results
  const filteredCities = weatherResults
    .filter((city): city is CityWeather => city !== null && city.condition === weatherType);
  
  return filteredCities;
};
