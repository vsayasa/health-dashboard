import { Router } from "express";
import type { User } from "../models/User";
import crypto from "crypto";

const router = Router();

// in-memory storage for now
const users: User[] = [];

// add a new user
router.post("/register", (req, res) => {
    const { username, email, password} = req.body;
        const new_user: User = {
        user_id: crypto.randomUUID(),
        username,
        email,
        password_hash: password, 
        created_at: new Date(),
    };
  users.push(new_user);
  res.status(201).json({ message: "User created", user_id: new_user.user_id });
});

// fetch user data
router.get("/", (req, res) => {
  res.json(users);
});

// temporary login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password_hash === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user_id: user.user_id });
});

export default router;
