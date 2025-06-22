
import React from 'react';

interface WeatherBackgroundProps {
  weatherIcon: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherIcon }) => {
  const getBackgroundImage = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'url("https://images.unsplash.com/photo-1533324268742-60b233802eef?w=1920&h=1080&fit=crop")';
      case 'rainy':
        return 'url("https://images.unsplash.com/photo-1509635022432-0220ac12960b?w=1920&h=1080&fit=crop")';
      case 'snowy':
        return 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop")';
      case 'cloudy':
        return 'url("https://images.unsplash.com/photo-1498085245356-7c3cda3b412f?w=1920&h=1080&fit=crop")';
      default:
        return 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop")';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{
        backgroundImage: getBackgroundImage(weatherIcon),
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
    </div>
  );
};

export default WeatherBackground;
