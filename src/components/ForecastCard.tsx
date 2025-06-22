import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ForecastDay } from '@/services/weather';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 md:w-8 md:h-8" />;
      case 'rainy': return <CloudRain className="w-6 h-6 md:w-8 md:h-8" />;
      case 'snowy': return <CloudSnow className="w-6 h-6 md:w-8 md:h-8" />;
      case 'cloudy': return <Cloud className="w-6 h-6 md:w-8 md:h-8" />;
      default: return <Sun className="w-6 h-6 md:w-8 md:h-8" />;
    }
  };

  const formatDate = (index: number) => {
    const today = new Date();
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + index);
    
    return forecastDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
      <div className="px-4 py-4 md:px-10 md:py-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-2 md:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
              <p className="font-medium mb-1 md:mb-2 text-xs md:text-sm">{formatDate(index)}</p>
              <div className="flex justify-center mb-1 md:mb-2">
                {getWeatherIcon(day.condition)}
              </div>
              <p className="text-xs md:text-sm text-white/80 mb-1">{day.high}°</p>
              <p className="text-xs text-white/60">{day.low}°</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ForecastCard;
