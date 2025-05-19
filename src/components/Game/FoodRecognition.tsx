
import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';
import { Check, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const USDA_API_KEY = 'yGHmAbrKp6cLbdsgDhMMlsgKf9P9Pb18BYGgPFhM';

interface FoodRecognitionProps {
  onFoodAnalyzed: (bloodGlucoseEffect: 'low' | 'normal' | 'high') => void;
}

const FoodRecognition: React.FC<FoodRecognitionProps> = ({ onFoodAnalyzed }) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const modelRef = useRef<mobilenet.MobileNet | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        toast.info("Loading food recognition model...");
        modelRef.current = await mobilenet.load();
        toast.success("Food recognition model loaded!");
      } catch (error) {
        console.error("Error loading model:", error);
        toast.error("Failed to load food recognition model");
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setImageURL(url);
    setPrediction(null);
    setNutrition(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const classifyImage = async () => {
    if (!modelRef.current || !imageRef.current) {
      toast.error("Model or image not loaded properly");
      return;
    }
    
    setLoading(true);
    try {
      const predictions = await modelRef.current.classify(imageRef.current);
      const label = predictions[0]?.className.split(",")[0];
      setPrediction(label);
      toast.info(`Identified as: ${label}`);
      await fetchNutrition(label);
    } catch (error) {
      console.error("Error classifying image:", error);
      toast.error("Failed to analyze food image");
    }
  };

  const fetchNutrition = async (query: string) => {
    try {
      const res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search`, {
        params: {
          api_key: USDA_API_KEY,
          query,
          pageSize: 1
        }
      });

      const food = res.data.foods?.[0];
      if (food) {
        const nutritionData = {
          description: food.description,
          calories: food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0,
          protein: food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0,
          carbs: food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
          fat: food.foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
          sugar: food.foodNutrients.find(n => n.nutrientName === 'Sugars, total including NLEA')?.value || 0,
        };
        
        setNutrition(nutritionData);
        
        // Determine the effect on blood glucose based on carbs/sugar content
        // This is a simplified approach - in a real app, this would be more sophisticated
        if (nutritionData.carbs < 15 || nutritionData.sugar < 5) {
          onFoodAnalyzed('low'); // Not enough carbs to raise blood sugar significantly
        } else if (nutritionData.carbs > 30 || nutritionData.sugar > 15) {
          onFoodAnalyzed('high'); // Too many carbs/sugar
        } else {
          onFoodAnalyzed('normal'); // Good balance for hypoglycemia
        }
        
        toast.success("Nutrition information retrieved");
      } else {
        setNutrition(null);
        toast.error("No nutritional data found for this food");
      }
    } catch (err) {
      console.error(err);
      setNutrition(null);
      toast.error("Failed to fetch nutrition information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Camera className="h-6 w-6 text-purple-600" />
          Food Recognition
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="text-center text-gray-600 mb-4">
          Please take a photo of the food you're about to eat to check if it's suitable for your current blood glucose level.
        </div>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {!imageURL ? (
            <Button 
              onClick={triggerFileInput}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Camera className="h-4 w-4" />
              {loading ? "Loading Model..." : "Take Photo"}
            </Button>
          ) : (
            <div className="w-full">
              <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 mb-4">
                <img
                  src={imageURL}
                  alt="Uploaded food"
                  ref={imageRef}
                  crossOrigin="anonymous"
                  className="w-full h-auto object-cover max-h-64"
                />
              </div>
              
              <Button
                onClick={classifyImage}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Analyze Food
                  </>
                )}
              </Button>
              
              {!loading && (
                <Button
                  onClick={triggerFileInput}
                  variant="outline"
                  className="mt-2 w-full md:w-auto flex items-center justify-center gap-2 border-purple-300"
                >
                  <X className="h-4 w-4" />
                  Take New Photo
                </Button>
              )}
            </div>
          )}
          
          {loading && <div className="text-center mt-4">⏳ Analyzing your food...</div>}

          {prediction && nutrition && (
            <div className="w-full mt-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2 text-purple-800 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Identified as: {prediction}
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Description:</div>
                <div>{nutrition.description}</div>
                
                <div className="font-medium">Calories:</div>
                <div>{nutrition.calories} kcal</div>
                
                <div className="font-medium">Protein:</div>
                <div>{nutrition.protein} g</div>
                
                <div className="font-medium">Carbs:</div>
                <div>{nutrition.carbs} g</div>
                
                <div className="font-medium">Fat:</div>
                <div>{nutrition.fat} g</div>
                
                <div className="font-medium">Sugar:</div>
                <div>{nutrition.sugar} g</div>
              </div>
            </div>
          )}

          {!loading && prediction && !nutrition && (
            <div className="mt-4 text-red-500 p-3 bg-red-50 rounded-lg w-full text-center">
              ❌ No nutritional values found for this food
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodRecognition;
