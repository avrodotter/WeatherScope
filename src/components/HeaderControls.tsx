
import React from 'react';
import { MapPin } from 'lucide-react';

interface HeaderControlsProps {
  location: string;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({ location }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2 text-white">
        <MapPin className="w-5 h-5" />
        <span className="text-lg font-medium">{location}</span>
      </div>
    </div>
  );
};

export default HeaderControls;
