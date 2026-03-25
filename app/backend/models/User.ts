export interface User {
  user_id: string;           // unique identifier per user
  username: string;
  email: string;
  password_hash: string;     // stores hashed password
  created_at: Date;
}