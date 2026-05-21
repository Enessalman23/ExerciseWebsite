import { useState, useCallback } from 'react';

export const useBmrCalculator = () => {
  const [formData, setFormData] = useState({
    gender: 'MALE',
    age: 25,
    weight: 70,
    height: 175,
    activity: 1.2, // Sedentary
  });

  const [results, setResults] = useState(null);

  const calculateBMR = useCallback((e) => {
    if (e) e.preventDefault();
    const { gender, age, weight, height, activity } = formData;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'MALE') {
        bmr += 5;
    } else {
        bmr -= 161;
    }
    
    const tdee = bmr * activity;
    
    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let bmiStatus = "";
    let bmiColor = "";
    
    if (bmi < 18.5) {
        bmiStatus = "Zayıf";
        bmiColor = "#F59E0B"; // Amber
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiStatus = "Normal Kilolu";
        bmiColor = "#10B981"; // Emerald
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiStatus = "Fazla Kilolu";
        bmiColor = "#F59E0B"; // Amber
    } else if (bmi >= 30 && bmi < 34.9) {
        bmiStatus = "1. Derece Obez";
        bmiColor = "#EF4444"; // Red
    } else if (bmi >= 35 && bmi < 39.9) {
        bmiStatus = "2. Derece Obez";
        bmiColor = "#DC2626"; // Darker Red
    } else {
        bmiStatus = "3. Derece Obez (Morbid)";
        bmiColor = "#991B1B"; // Safest Red
    }
    
    setResults({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        cut: Math.round(tdee - 500),
        bulk: Math.round(tdee + 500),
        bmi: bmi.toFixed(1),
        bmiStatus,
        bmiColor
    });
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: parseFloat(value) || value 
    }));
  }, []);

  return {
    formData,
    results,
    calculateBMR,
    handleChange
  };
};
