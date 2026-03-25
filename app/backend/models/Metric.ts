export interface Metric {
  user_id: string;          // foreign key to User
  date: string;             // ISO string
  sleep_hours?: number;
  exercise_hours?: number;
  calories?: number;
  weight_lbs?: number;
  mood?: number;            // 1–5 scale
  file_url?: string;        // optional file from Blob Storage
}

