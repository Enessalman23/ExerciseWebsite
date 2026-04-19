import React from 'react';
import { Activity, Zap, Flame, Heart } from 'lucide-react';

export const equipmentsList = [
  "Dumbbell", "Barbell", "Body weight", "Cable", "Machine", 
  "Kettlebell", "Medicine Ball", "Band", "Smith Machine", "Pilates"
];

export const GOAL_OPTIONS = [
  { id: 'Kilo Verme', title: 'Kilo Kaybı', icon: <Activity />, desc: 'Vücut yağını azalt ve forma gir.' },
  { id: 'Kas Gelişimi', title: 'Kas & Güç', icon: <Zap />, desc: 'Kas kütlesini artır ve güçlen.' },
  { id: 'Kondisyon', title: 'Kondisyon', icon: <Flame />, desc: 'Dayanıklılığı ve hızı artır.' },
  { id: 'Genel Sağlık', title: 'Yaşam Tarzı', icon: <Heart />, desc: 'Daha hareketli ve zinde bir yaşam.' }
];

export const EXPERIENCE_LEVELS = ['Başlangıç', 'Orta', 'İleri'];

export const DIET_MEAL_OPTIONS = [
  { value: "2", label: "2 Öğün (Aralıklı Oruç)" },
  { value: "3", label: "3 Öğün (Klasik)" },
  { value: "4", label: "4 Öğün (Ara Öğünlü)" },
  { value: "5", label: "5 Öğün (Sporcu Tipi)" },
  { value: "6", label: "6 Öğün (Profesyonel)" }
];
