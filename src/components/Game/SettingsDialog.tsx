
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the Club type
interface Club {
  name: string;
  dayOfWeek: string;
  time: string;
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  username: string;
  highScore: number;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  username,
  highScore
}) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isEditingClubs, setIsEditingClubs] = useState(false);
  const [newClub, setNewClub] = useState<Club>({ name: "", dayOfWeek: "Monday", time: "12:00" });
  
  // Days of the week for selection
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Load clubs from localStorage when component mounts
  useEffect(() => {
    const savedClubs = localStorage.getItem('chocoDashClubs');
    if (savedClubs) {
      try {
        setClubs(JSON.parse(savedClubs));
      } catch (error) {
        console.error("Error parsing clubs from localStorage:", error);
        // Initialize with empty array if parse fails
        setClubs([]);
      }
    }
  }, []);
  
  // Save clubs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chocoDashClubs', JSON.stringify(clubs));
  }, [clubs]);
  
  const handleAddClub = () => {
    if (newClub.name && clubs.length < 2) {
      setClubs([...clubs, { ...newClub }]);
      setNewClub({ name: "", dayOfWeek: "Monday", time: "12:00" });
    }
  };
  
  const handleRemoveClub = (index: number) => {
    setClubs(clubs.filter((_, i) => i !== index));
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Username (non-editable) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input value={username} disabled className="bg-gray-100" />
          </div>
          
          {/* High Score (non-editable) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">High Score</label>
            <Input value={highScore} disabled className="bg-gray-100" />
          </div>
          
          {/* Screen Time Limit (non-editable) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Screen Time Limit</label>
            <Input value="2 minutes" disabled className="bg-gray-100" />
          </div>
          
          {/* Clubs (editable) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Clubs</label>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsEditingClubs(!isEditingClubs)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Display current clubs */}
            {clubs.length > 0 ? (
              <div className="space-y-3">
                {clubs.map((club, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <p className="font-medium">{club.name}</p>
                      <p className="text-sm text-gray-500">
                        {club.dayOfWeek} at {club.time}
                      </p>
                    </div>
                    {isEditingClubs && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveClub(index)}
                        className="h-8"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No clubs added yet.</p>
            )}
            
            {/* Club editing form */}
            {isEditingClubs && clubs.length < 2 && (
              <div className="border border-gray-200 rounded-md p-3 space-y-3 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Club Name</label>
                  <Input 
                    value={newClub.name} 
                    onChange={(e) => setNewClub({...newClub, name: e.target.value})} 
                    placeholder="Enter club name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Day of Week</label>
                  <Select 
                    value={newClub.dayOfWeek} 
                    onValueChange={(value) => setNewClub({...newClub, dayOfWeek: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input 
                    type="time"
                    value={newClub.time} 
                    onChange={(e) => setNewClub({...newClub, time: e.target.value})} 
                  />
                </div>
                
                <Button 
                  onClick={handleAddClub} 
                  disabled={!newClub.name}
                  className="w-full"
                >
                  Add Club
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
