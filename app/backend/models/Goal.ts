export interface Goal {
  user_id: string;          // foreign key
  metric_type: string;      // "sleep_hours", "exercise_hours", "calories"
  goal_value: number;       // numeric goal
  start_date: string;
  end_date: string;
}

