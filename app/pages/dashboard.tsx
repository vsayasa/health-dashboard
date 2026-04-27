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
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const [sleepData, setSleepData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [wellnessData, setWellnessData] = useState<any[]>([]);

  const [goals, setGoals] = useState<any>({
    sleep: 0,
    exercise: 0,
    nutrition: 0
  });

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user?.email) {
        const name = data.user.email.split("@")[0];
        setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };
    getUser();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // FETCH DATA
  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/metrics?user_id=${user.id}`);
        const data = await res.json();

        const sleep: any[] = [];
        const exercise: any[] = [];
        const nutrition: any[] = [];
        const wellness: any[] = [];

        let totalSleep = 0;
        let totalExercise = 0;
        let totalNutrition = 0;

        data.forEach((item: any) => {
          const day = new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          });

          if (item.sleep?.hours != null) {
            sleep.push({ day, hours: item.sleep.hours });
            totalSleep += item.sleep.hours;
          }

          if (item.exercise?.hours != null) {
            exercise.push({ day, hours: item.exercise.hours });
            totalExercise += item.exercise.hours;
          }

          if (item.nutrition) {
            const protein = item.nutrition.protein || 0;
            totalNutrition += protein;

            nutrition.push(
              { name: "Protein", value: protein },
              { name: "Carbs", value: item.nutrition.carbs || 0 },
              { name: "Fat", value: item.nutrition.fat || 0 }
            );
          }

          if (item.wellness) {
            wellness.push({
              sleep: item.sleep?.hours || 0,
              mood: item.wellness.mood || 0,
            });
          }
        });

        // SET DATA
        setSleepData(sleep);
        setExerciseData(exercise);
        setNutritionData(nutrition);
        setWellnessData(wellness);

        // SET GOALS FROM API (assuming included once)
        if (data[0]?.goals) {
          setGoals(data[0].goals);
        }

        // STORE TOTALS
        setTotals({
          sleep: totalSleep,
          exercise: totalExercise,
          nutrition: totalNutrition
        });

      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [user]);

  const [totals, setTotals] = useState<any>({
    sleep: 0,
    exercise: 0,
    nutrition: 0
  });

  // CALCULATIONS
  const getPercent = (value: number, goal: number) => {
    if (!goal) return 0;
    return Math.min((value / goal) * 100, 100);
  };

  const overallPercent = Math.round(
    (
      getPercent(totals.sleep, goals.sleep) +
      getPercent(totals.exercise, goals.exercise) +
      getPercent(totals.nutrition, goals.nutrition)
    ) / 3
  );

  const donutData = [
    { name: "Completed", value: overallPercent },
    { name: "Remaining", value: 100 - overallPercent }
  ];

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      
      <div className="absolute w-[400px] h-[400px] bg-green-500/10 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col gap-6 relative z-20">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-3 mt-6">
          <NavLink to="/dashboard" className={({ isActive }) =>
            `px-4 py-2 rounded-full ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black" : "text-gray-400 hover:text-white"}`
          }>
            Dashboard
          </NavLink>
          <NavLink to="/logmetrics" className={({ isActive }) =>
            `px-4 py-2 rounded-full ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black" : "text-gray-400 hover:text-white"}`
          }>
            Log Metrics
          </NavLink>
          <NavLink to="/files" className={({ isActive }) =>
            `px-4 py-2 rounded-full ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black" : "text-gray-400 hover:text-white"}`
          }>
            Files
          </NavLink>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400">{currentDate}</p>
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <span>{firstName}</span>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                {firstName.charAt(0)}
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl">
                <button onClick={() => navigate("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-800">Profile</button>
                <button onClick={() => navigate("/settings")} className="block w-full text-left px-4 py-2 hover:bg-gray-800">Settings</button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400">Logout</button>
              </div>
            )}
          </div>
        </div>
{/* QUICK STATS ROW */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
{[
{ label: "Total Sleep", value: `${totals.sleep}h`, color: "border-green-500/50" },
{ label: "Avg Exercise", value: `${(totals.exercise / 7).toFixed(1)}h`, color: "border-blue-500/50" },
{ label: "Protein Intake", value: `${totals.nutrition}g`, color: "border-yellow-500/50" },
{ label: "Status", value: "Active", color: "border-purple-500/50" }
].map((stat, i) => (
<div key={i} className={`bg-gray-900/40 p-4 rounded-xl border-l-4 ${stat.color} backdrop-blur-sm`}>
<p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</p>
<p className="text-2xl font-bold mt-1">{stat.value}</p>
</div>
))}
</div>
        {/* GOALS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Progress Bars */}
          <div className="lg:col-span-2 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="mb-4 text-gray-300">Weekly Goals</h2>

            {["sleep", "exercise", "nutrition"].map((key: any) => {
              const percent = getPercent(totals[key], goals[key]);

              return (
                <div key={key} className="mb-5">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key}</span>
                    <span>{totals[key]} / {goals[key]}</span>
                  </div>

                  <div className="w-full bg-gray-800 h-3 rounded-full">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donut Chart */}
          <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
            <h2 className="text-gray-300 mb-4">Goal Completion</h2>

            <div className="w-full h-[200px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#1f2937" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-xl font-semibold">{overallPercent}%</p>
          </div>
        </div>

        {/* EXISTING CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="mb-4">Sleep Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sleepData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="hours" stroke="#4ade80" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="mb-4">Nutrition</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={nutritionData} dataKey="value" innerRadius={60}>
                  {nutritionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="mb-4">Exercise</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={exerciseData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="mb-4">Wellness</h2>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <XAxis dataKey="sleep" />
                <YAxis dataKey="mood" />
                <Tooltip />
                <Scatter data={wellnessData} fill="#a78bfa" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}