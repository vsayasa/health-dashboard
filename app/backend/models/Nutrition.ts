export interface Nutrition {
  nutrition_id: string;
  user_id: string;
  date: string;
  total_calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}