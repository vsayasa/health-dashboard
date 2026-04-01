export interface Exercise {
  exercise_id: string;
  user_id: string;
  date: string;
  exercise_hours: number;
  exercise_type?: string;
  calories_burned?: number;
}