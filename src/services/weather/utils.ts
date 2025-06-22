
// Map OpenWeatherMap icons to our internal icon system
export const mapWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': 'sunny', '01n': 'sunny',
    '02d': 'cloudy', '02n': 'cloudy',
    '03d': 'cloudy', '03n': 'cloudy',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rainy', '09n': 'rainy',
    '10d': 'rainy', '10n': 'rainy',
    '11d': 'rainy', '11n': 'rainy',
    '13d': 'snowy', '13n': 'snowy',
    '50d': 'cloudy', '50n': 'cloudy'
  };
  return iconMap[iconCode] || 'cloudy';
};

// API request function
export const makeApiRequest = async (url: string): Promise<any> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
