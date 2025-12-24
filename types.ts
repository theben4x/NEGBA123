
export interface BlessingResult {
  foodName: string;
  brachaRishonaTitle: string;
  brachaRishonaText: string;
  brachaAcharonaTitle: string;
  brachaAcharonaText: string;
  tip: string;
  category: 'fruit' | 'vegetable' | 'grain' | 'drink' | 'sweet' | 'other';
  icon?: string;
}

export interface FoodItem {
  label: string;
  icon: string;
  data?: BlessingResult;
}

export interface HalachaItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
  source: string;
}

export interface HalachaResult {
  question: string;
  answer: string;
  summary: string;
  sources: string[];
}

export interface InspirationQuote {
  text: string;
  source: string;
  author: string;
}

export interface Prayer {
  title: string;
  text: string;
  description: string;
  icon: string;
}

export interface City {
  name: string;
  geonameid: string;
}

export interface HebcalResponse {
  items: Array<{
    title: string;
    date: string;
    category: string;
    hebrew: string;
    memo?: string;
  }>;
}

export interface ShabbatTimes {
  candles: string;
  havdalah: string;
  parasha: string;
  rabbeinuTam: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index (0-3)
  explanation?: string;
}

export interface ZmanimData {
  alotHaShachar: string; // Dawn
  sunrise: string;       // Netz
  sofZmanShma: string;   // Shma (Gra)
  sofZmanTfila: string;  // Tfila (Gra)
  chatzot: string;       // Midday
  minchaGedola: string;  // Earliest Mincha
  plagHaMincha: string;  // Plag
  sunset: string;        // Shkia
  tzeit7083deg: string;  // Tzeit (Standard)
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Can be HTML or Markdown text
  author: string;
  date: string;
  readTime: string;
  imageEmoji: string;
  tags: string[];
}
