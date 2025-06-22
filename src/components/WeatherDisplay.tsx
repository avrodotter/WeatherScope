import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Thermometer, Eye, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { WeatherData } from '@/services/weather';

interface WeatherDisplayProps {
  weather: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 md:w-12 md:h-12" />;
      case 'rainy': return <CloudRain className="w-8 h-8 md:w-12 md:h-12" />;
      case 'snowy': return <CloudSnow className="w-8 h-8 md:w-12 md:h-12" />;
      case 'cloudy': return <Cloud className="w-8 h-8 md:w-12 md:h-12" />;
      default: return <Sun className="w-8 h-8 md:w-12 md:h-12" />;
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
      <div className="px-6 py-6 md:px-12 md:py-8 text-center">
        <div className="mb-3 md:mb-4">
          {getWeatherIcon(weather.icon)}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-2">
          {weather.temperature}°C
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-2">
          {weather.condition}
        </p>
        
        <p className="text-base md:text-lg text-white/80 mb-4 md:mb-6 capitalize">
          {weather.description}
        </p>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-2">
              <Thermometer className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span className="text-xs md:text-sm text-white/80">Humidity</span>
            </div>
            <p className="text-lg md:text-xl font-semibold">{weather.humidity}%</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-2">
              <Wind className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span className="text-xs md:text-sm text-white/80">Wind</span>
            </div>
            <p className="text-lg md:text-xl font-semibold">{weather.windSpeed} km/h</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-2">
              <Eye className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span className="text-xs md:text-sm text-white/80">Visibility</span>
            </div>
            <p className="text-lg md:text-xl font-semibold">{weather.visibility} km</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherDisplay;
