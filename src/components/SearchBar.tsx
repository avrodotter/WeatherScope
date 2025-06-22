import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCities, City } from '@/services/weather';

interface SearchBarProps {
  onCitySelect: (city: City) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Handle city search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length === 0) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      if (searchQuery.length < 2) {
        return; // Wait for at least 2 characters
      }

      try {
        setSearchLoading(true);
        console.log('Searching for cities:', searchQuery);
        const cities = await searchCities(searchQuery);
        console.log('Search results:', cities);
        setSearchResults(cities);
        setShowSearchResults(cities.length > 0);
      } catch (err) {
        console.error('Error searching cities:', err);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Select a city from search results
  const selectCity = (city: City) => {
    console.log('Selecting city:', city);
    setSearchQuery(`${city.name}, ${city.country}`);
    setShowSearchResults(false);
    onCitySelect(city);
  };

  return (
    <div className="max-w-md mx-auto mb-8 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 stroke-2" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="pl-10 backdrop-blur-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
        />
        {searchLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-lg bg-white/90 border border-white/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((city, index) => (
            <div
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => selectCity(city)}
              className="p-3 hover:bg-white/20 cursor-pointer border-b border-gray-200/20 last:border-b-0 transition-colors text-gray-800 hover:text-gray-900"
            >
              <span className="font-medium">{city.name}, {city.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
