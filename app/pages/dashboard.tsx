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

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // ✅ GET USER
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

  // ✅ LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // ✅ FETCH DATA
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

        data.forEach((item: any) => {
          const day = new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          });

          if (item.sleep?.hours != null) {
            sleep.push({ day, hours: item.sleep.hours });
          }
          if (item.exercise?.hours != null) {
            exercise.push({ day, hours: item.exercise.hours });
          }
          if (item.nutrition) {
            nutrition.push(
              { name: "Protein", value: item.nutrition.protein || 0 },
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

        setSleepData(sleep);
        setExerciseData(exercise);
        setNutritionData(nutrition);
        setWellnessData(wellness);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* BACKGROUND DECOR */}
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
            `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium" : "text-gray-400 hover:text-white"}`
          }>
            Dashboard
          </NavLink>
          <NavLink to="/logmetrics" className={({ isActive }) =>
            `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium" : "text-gray-400 hover:text-white"}`
          }>
            Log Metrics
          </NavLink>
          <NavLink to="/files" className={({ isActive }) =>
            `px-4 py-2 rounded-full transition-colors ${isActive ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium" : "text-gray-400 hover:text-white"}`
          }>
            Files
          </NavLink>
        </nav>
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-8 relative z-10 overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400 mt-1">{currentDate}</p>
          </div>

          {/* PROFILE DROPDOWN WRAPPER */}
          <div 
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            {/* TRIGGER */}
            <div className="flex items-center gap-3 cursor-pointer group py-2">
              <span className="text-gray-300 group-hover:text-white transition-colors">{firstName}</span>
              <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-green-400 transition-all">
                {firstName.charAt(0)}
              </div>
            </div>

            {/* THE MENU (Wrapped in a bridge div to prevent hover loss) */}
            {menuOpen && (
              <div className="absolute right-0 pt-2 w-48 z-50">
                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm transition-colors border-b border-gray-800">
                    Profile
                  </button>
                  <button onClick={() => navigate("/settings")} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm transition-colors border-b border-gray-800">
                    Settings
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm text-red-400 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SLEEP */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-gray-300 font-medium mb-4">Sleep Trends</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={12} />
                  <YAxis stroke="#4b5563" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                  <Line type="monotone" dataKey="hours" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NUTRITION */}
          <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-gray-300 font-medium mb-4">Nutrition</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nutritionData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {nutritionData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EXERCISE */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-gray-300 font-medium mb-4">Exercise Activity</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData}>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={12} />
                  <YAxis stroke="#4b5563" fontSize={12} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                  <Bar dataKey="hours" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* WELLNESS */}
          <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-gray-300 font-medium mb-4">Wellness Correlation</h2>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <XAxis type="number" dataKey="sleep" name="Sleep" stroke="#4b5563" fontSize={12} />
                  <YAxis type="number" dataKey="mood" name="Mood" stroke="#4b5563" fontSize={12} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={wellnessData} fill="#a78bfa" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div> {/* End Grid */}
      </div> {/* End Main Content */}
    </div> // End Root
  );
}