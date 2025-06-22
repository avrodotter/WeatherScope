import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HourlyForecast } from '@/services/weather';

interface HourlyForecastCardProps {
  hourlyData: HourlyForecast[];
}

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({ hourlyData }) => {
  const getWeatherIcon = (condition: string, size: string = "w-3 h-3 md:w-4 md:h-4") => {
    switch (condition) {
      case 'sunny': return <Sun className={size} />;
      case 'rainy': return <CloudRain className={size} />;
      case 'snowy': return <CloudSnow className={size} />;
      case 'cloudy': return <Cloud className={size} />;
      default: return <Sun className={size} />;
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 backdrop-blur-lg rounded-lg p-3 border border-white/20 text-white">
          <p className="font-medium">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            {getWeatherIcon(data.icon)}
            <span>{data.temperature}°C</span>
          </div>
          <p className="text-sm text-white/80 capitalize">{data.condition}</p>
        </div>
      );
    }
    return null;
  };

  // Transform data for the chart
  const chartData = hourlyData.map(item => ({
    ...item,
    displayTime: item.time.substring(0, 5) // Show only HH:MM
  }));

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
      <div className="px-4 py-4 md:px-10 md:py-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">24-Hour Forecast</h2>
        
        {/* Temperature Chart */}
        <div className="h-48 md:h-64 mb-4 md:mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
              <XAxis 
                dataKey="displayTime" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 10 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth={2}
                dot={{ fill: 'rgba(255, 255, 255, 0.9)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Details Grid */}
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1 sm:gap-2 md:gap-3">
          {hourlyData.slice(0, 12).map((hour, index) => (
            <div key={index} className="text-center p-1 md:p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
              <p className="text-xs text-white/80 mb-1">{hour.time.substring(0, 5)}</p>
              <div className="flex justify-center mb-1">
                {getWeatherIcon(hour.icon)}
              </div>
              <p className="text-xs md:text-sm font-medium">{hour.temperature}°</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default HourlyForecastCard;
