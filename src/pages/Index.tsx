
import React, { useState, useEffect } from 'react';
import { 
  getCurrentWeather, 
  getForecast, 
  getHourlyForecast,
  getCurrentLocation,
  WeatherData,
  ForecastDay,
  HourlyForecast,
  City 
} from '@/services/weather';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import WeatherDisplay from '@/components/WeatherDisplay';
import SearchBar from '@/components/SearchBar';
import ForecastCard from '@/components/ForecastCard';
import HourlyForecastCard from '@/components/HourlyForecastCard';
import WeatherBackground from '@/components/WeatherBackground';
import HeaderControls from '@/components/HeaderControls';
import WeatherTypeTabs from '@/components/WeatherTypeTabs';
import Footer from '@/components/Footer';

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading Weather Data...');
  const [error, setError] = useState<string | null>(null);

  // Load weather data for given coordinates
  const loadWeatherData = async (lat: number, lon: number, preferredLocation?: string) => {
    try {
      setLoading(true);
      setError(null);
      setLoadingMessage('Fetching weather data...');
      
      const [weatherData, forecastData, hourlyData] = await Promise.all([
        getCurrentWeather(lat, lon, preferredLocation),
        getForecast(lat, lon),
        getHourlyForecast(lat, lon)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError('Failed to load weather data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load user's current location weather on component mount
  useEffect(() => {
    const initializeWeather = async () => {
      try {
        setLoadingMessage('Getting your location...');
        const location = await getCurrentLocation();
        await loadWeatherData(location.lat, location.lon);
      } catch (err) {
        console.error('Error getting location:', err);
        // Fallback to a default city (London) if geolocation fails
        setLoadingMessage('Loading default location...');
        await loadWeatherData(51.5074, -0.1278); // London coordinates
      }
    };

    initializeWeather();
  }, []);

  // Select a city from search results or weather type tabs
  const handleCitySelect = async (city: City) => {
    const preferredLocation = `${city.name}, ${city.country}`;
    await loadWeatherData(city.lat, city.lon, preferredLocation);
  };

  // Retry loading weather data
  const handleRetry = async () => {
    try {
      const location = await getCurrentLocation();
      await loadWeatherData(location.lat, location.lon);
    } catch (err) {
      // Fallback to default location
      await loadWeatherData(51.5074, -0.1278);
    }
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // Show error screen
  if (error) {
    return <ErrorScreen error={error} onRetry={handleRetry} />;
  }

  // Don't render if no weather data
  if (!weather) {
    return <LoadingScreen message="Initializing..." />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Weather Background Wallpaper */}
      <WeatherBackground weatherIcon={weather.icon} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-6 md:py-8 flex-1 space-y-6 md:space-y-8">
        {/* Header */}
        <HeaderControls location={weather.location} />

        {/* Search Bar */}
        <SearchBar onCitySelect={handleCitySelect} />

        {/* Current Weather Card */}
        <WeatherDisplay weather={weather} />

        {/* 24-Hour Forecast */}
        <HourlyForecastCard hourlyData={hourlyForecast} />

        {/* 5-Day Forecast */}
        <ForecastCard forecast={forecast} />

        {/* Weather Type Tabs for City Search - moved to bottom */}
        <WeatherTypeTabs onCitySelect={handleCitySelect} />
      </div>

      {/* Footer - now properly positioned */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
