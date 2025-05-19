
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed top-4 left-4 z-[100]">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-gray-800 bg-opacity-70 hover:bg-gray-700 shadow-md"
        onClick={onClick}
        aria-label="Settings"
      >
        <Settings className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default SettingsButton;
