import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';

const USDA_API_KEY = 'yGHmAbrKp6cLbdsgDhMMlsgKf9P9Pb18BYGgPFhM';

const FoodRecognition = () => {
  const [imageURL, setImageURL] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const modelRef = useRef<mobilenet.MobileNet | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await mobilenet.load();
    };
    loadModel();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImageURL(url);
    setPrediction(null);
    setNutrition(null);
  };

  const classifyImage = async () => {
    if (!modelRef.current || !imageRef.current) return;
    setLoading(true);
    const predictions = await modelRef.current.classify(imageRef.current);
    const label = predictions[0]?.className.split(",")[0];
    setPrediction(label);
    fetchNutrition(label);
  };

  const fetchNutrition = async (query) => {
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
        setNutrition({
          description: food.description,
          calories: food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value,
          protein: food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value,
          carbs: food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value,
          fat: food.foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value,
          sugar: food.foodNutrients.find(n => n.nutrientName === 'Sugars, total including NLEA')?.value,
        });
      } else {
        setNutrition(null);
      }
    } catch (err) {
      console.error(err);
      setNutrition(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        🍽️ Food recognition and nutritional values display
      </h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {imageURL && (
        <div>
          <img
            src={imageURL}
            alt="Uploaded food"
            ref={imageRef}
            crossOrigin="anonymous"
            className="max-w-full mb-4 rounded shadow"
          />
          <button
            onClick={classifyImage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Analyze image
          </button>
        </div>
      )}

      {loading && <p className="mt-4">⏳ loading...</p>}

      {prediction && nutrition && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            🔍 Identified as dish: {prediction}
          </h2>
          <table className="w-full text-left border-t border-b border-gray-200">
            <tbody>
              <tr>
                <td className="py-1">🍔 Description:</td>
                <td>{nutrition.description}</td>
              </tr>
              <tr>
                <td className="py-1">🔥 Calories:</td>
                <td>{nutrition.calories} kcal</td>
              </tr>
              <tr>
                <td className="py-1">🥩 Protein:</td>
                <td>{nutrition.protein} g</td>
              </tr>
              <tr>
                <td className="py-1">🍞 Carbs:</td>
                <td>{nutrition.carbs} g</td>
              </tr>
              <tr>
                <td className="py-1">🥑 Fat:</td>
                <td>{nutrition.fat} g</td>
              </tr>
              <tr>
                <td className="py-1">🍬 Sugar:</td>
                <td>{nutrition.sugar} g</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!loading && prediction && !nutrition && (
        <p className="mt-4 text-red-500">
          ❌ No nutritional values found for this dish
        </p>
      )}
    </div>
  );
};

export default FoodRecognition;
