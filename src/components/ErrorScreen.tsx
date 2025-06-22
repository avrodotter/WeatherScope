
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white p-8 max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
        <h2 className="text-2xl font-semibold mb-4">Weather Data Unavailable</h2>
        <p className="text-white/80 mb-6">{error}</p>
        <Button 
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    </div>
  );
};

export default ErrorScreen;
