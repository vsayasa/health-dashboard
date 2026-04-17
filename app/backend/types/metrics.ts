export interface Metrics {
  id: string;
  user_id: string;
  date: string;

  sleep?: {
    hours?: number;
    quality?: number;
  };

  exercise?: {
    hours?: number;
    type?: string;
  };

  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };

  wellness?: {
    mood?: number;
    stress?: number;
  };
}