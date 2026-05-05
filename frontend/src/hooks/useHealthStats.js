import { useMemo } from 'react';

const BMI_CATEGORIES = [
  { label: 'Zayıf', color: '#3b82f6', min: 0, max: 18.5 },
  { label: 'Normal', color: '#10b981', min: 18.5, max: 25 },
  { label: 'Fazla Kilolu', color: '#f59e0b', min: 25, max: 30 },
  { label: 'Obez', color: '#ef4444', min: 30, max: 100 }
];

const calculateHealthStats = (m) => {
  if (!m || !m.weight || !m.height) return null;
  const bmi = (m.weight / ((m.height / 100) ** 2)).toFixed(1);
  const categorySize = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[3];
  
  let bmr = 0;
  if (m.gender === 'MALE') {
    bmr = 88.362 + (13.397 * m.weight) + (4.799 * m.height) - (5.677 * (m.age || 25));
  } else {
    bmr = 447.593 + (9.247 * m.weight) + (3.098 * m.height) - (4.330 * (m.age || 25));
  }

  const activityMultipliers = {
    'SEDENTARY': 1.2,
    'LIGHTLY_ACTIVE': 1.375,
    'MODERATELY_ACTIVE': 1.55,
    'VERY_ACTIVE': 1.725,
    'SUPER_ACTIVE': 1.9
  };
  const tdee = Math.round(bmr * (activityMultipliers[m.activityLevel] || 1.2));
  
  return { bmi, category: categorySize, bmr: Math.round(bmr), tdee };
};

export const useHealthStats = (metrics) => {
  const healthStats = useMemo(() => calculateHealthStats(metrics), [metrics]);
  return healthStats;
};
