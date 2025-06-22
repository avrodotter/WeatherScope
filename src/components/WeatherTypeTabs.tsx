
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { searchCitiesByWeatherType, CityWeather } from '@/services/weather';

interface WeatherTypeTabsProps {
  onCitySelect: (city: { name: string; country: string; lat: number; lon: number }) => void;
}

const WeatherTypeTabs: React.FC<WeatherTypeTabsProps> = ({ onCitySelect }) => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sunny');

  const weatherTypes = [
    { id: 'sunny', label: 'Sunny', icon: Sun },
    { id: 'rainy', label: 'Rainy', icon: CloudRain },
    { id: 'cloudy', label: 'Cloudy', icon: Cloud },
    { id: 'snowy', label: 'Snowy', icon: CloudSnow },
  ];

  const loadCitiesForWeatherType = async (weatherType: string) => {
    setLoading(true);
    
    try {
      console.log('Searching cities with weather type:', weatherType);
      const weatherCities = await searchCitiesByWeatherType(weatherType);
      console.log('Found cities:', weatherCities);
      setCities(weatherCities);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cities for the default 'sunny' tab on component mount
  useEffect(() => {
    loadCitiesForWeatherType('sunny');
  }, []);

  const handleTabChange = async (weatherType: string) => {
    setActiveTab(weatherType);
    await loadCitiesForWeatherType(weatherType);
  };

  const handleCityClick = (city: CityWeather) => {
    onCitySelect({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    });
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'rainy':
        return '🌧️';
      case 'cloudy':
        return '☁️';
      case 'snowy':
        return '🌨️';
      default:
        return '🌤️';
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
      <div className="px-4 py-4 md:px-10 md:py-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Explore Popular Cities by Weather</h2>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/10 backdrop-blur-sm mb-4 md:mb-6 h-auto p-1">
            {weatherTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs sm:text-sm md:text-base py-2 md:py-3"
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="sm:hidden">{type.label.slice(0, 4)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {weatherTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-8 md:py-12">
                  <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-white"></div>
                  <span className="ml-2 text-white text-sm md:text-base">Loading cities...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {cities.length > 0 ? (
                    cities.map((city, index) => (
                      <div
                        key={`${city.name}-${city.country}-${index}`}
                        onClick={() => handleCityClick(city)}
                        className="cursor-pointer p-3 md:p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 min-h-[80px] md:min-h-[90px] hover:scale-105 transform"
                      >
                        <div className="flex items-center justify-between h-full">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm md:text-base truncate">{city.name}</h4>
                            <p className="text-white/70 text-xs md:text-sm truncate">{city.country}</p>
                          </div>
                          <div className="text-right ml-2 md:ml-3 flex-shrink-0">
                            <div className="text-xl md:text-2xl mb-1">{getWeatherIcon(city.condition)}</div>
                            <p className="text-white text-sm md:text-lg font-bold">{city.temperature}°C</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 md:py-12 text-white/70">
                      <p className="text-sm md:text-base">No cities found with {type.label.toLowerCase()} weather at the moment.</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
};

export default WeatherTypeTabs;
