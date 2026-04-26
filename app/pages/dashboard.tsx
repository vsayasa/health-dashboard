import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from "recharts";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [sleepData, setSleepData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [wellnessData, setWellnessData] = useState<any[]>([]);

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  // 1. Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // 2. Fetch metrics from backend
  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      const res = await fetch(`/api/metrics?user_id=${user.id}`);
      const data = await res.json();

      // Transform backend data → chart format
      const sleep: any[] = [];
      const exercise: any[] = [];
      const nutrition: any[] = [];
      const wellness: any[] = [];

      data.forEach((item: any) => {
        const day = new Date(item.date).toLocaleDateString("en-US", {
          weekday: "short",
        });

        // Sleep
        if (item.sleep?.hours != null) {
          sleep.push({ day, hours: item.sleep.hours });
        }

        // Exercise
        if (item.exercise?.hours != null) {
          exercise.push({ day, hours: item.exercise.hours });
        }

        // Nutrition (pie chart needs aggregation)
        if (item.nutrition) {
          nutrition.push(
            { name: "Protein", value: item.nutrition.protein || 0 },
            { name: "Carbs", value: item.nutrition.carbs || 0 },
            { name: "Fat", value: item.nutrition.fat || 0 }
          );
        }

        // Wellness scatter
        if (item.wellness) {
          wellness.push({
            sleep: item.sleep?.hours || 0,
            mood: item.wellness.mood || 0,
          });
        }
      });

      setSleepData(sleep);
      setExerciseData(exercise);
      setNutritionData(nutrition);
      setWellnessData(wellness);
    };

    fetchMetrics();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* SIDEBAR (UNCHANGED) */}
      <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col gap-6 relative z-10">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-3 mt-6">

          {/* old dashboard button 
          <button className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-full text-left font-medium">
            Dashboard
          </button>
          */}

<NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Dashboard
</NavLink>

<NavLink
  to="/logmetrics"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Log Metrics
</NavLink>

<NavLink
  to="/files"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Files
</NavLink>

        </nav>
      </div>

      {/* MAIN (UNCHANGED UI STRUCTURE) */}
      <div className="flex-1 p-6 relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400">March 28, 2026</p>
          </div>

          <div className="flex gap-3 items-center">
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">
              Time Range
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">
              Date
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">
              Reset
            </button>
            <div className="ml-4 text-gray-400">
              Welcome, {user?.email || "User"}!
            </div>
          </div>
        </div>

        {/* GRID (UNCHANGED UI) */}
        <div className="grid grid-cols-3 gap-6">

          {/* SLEEP */}
          <div className="col-span-2 bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">Sleep</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NUTRITION */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">Nutrition</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nutritionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                    {nutritionData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EXERCISE */}
          <div className="col-span-2 bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">Exercise</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData}>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* WELLNESS */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">Wellness</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <XAxis type="number" dataKey="sleep" stroke="#888" />
                  <YAxis type="number" dataKey="mood" stroke="#888" />
                  <Tooltip />
                  <Scatter data={wellnessData} fill="#a78bfa" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CALORIES (placeholder until metrics endpoint extended) */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Calories</h2>
            <p className="text-3xl mt-2 font-semibold">--</p>
          </div>

          {/* WEIGHT */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Weight</h2>
            <p className="text-3xl mt-2 font-semibold">--</p>
          </div>

        </div>
      </div>
    </div>
  );
}