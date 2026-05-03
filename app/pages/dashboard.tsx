import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer,
  PieChart, Pie, Cell,
  ScatterChart, Scatter
} from "recharts";
import { useNavigate, NavLink } from "react-router";
import { Link } from "react-router";
import Logo from "../components/ui/Logo";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const [sleepData, setSleepData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [wellnessData, setWellnessData] = useState<any[]>([]);

  const [range, setRange] = useState("7");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sleepMetric, setSleepMetric] = useState("hours");
  const [exerciseType, setExerciseType] = useState("all");
  const [wellnessX, setWellnessX] = useState("sleep");
  const [wellnessY, setWellnessY] = useState("mood");

  const COLORS = ["#bfd06a", "#6aaed0", "#2f98bc"];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const formatDate = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const formatMMDD = (dateString: string) => {
    const d = new Date(`${dateString}T00:00:00`);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };

  const buildDateRange = (start: string, end: string) => {
    const dates: string[] = [];
    const current = new Date(`${start}T00:00:00`);
    const last = new Date(`${end}T00:00:00`);

    while (current <= last) {
      dates.push(formatDate(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  useEffect(() => {
    const today = new Date();

    if (range === "7") {
      const start = new Date();
      start.setDate(today.getDate() - 6);
      setStartDate(formatDate(start));
      setEndDate(formatDate(today));
    } else if (range === "30") {
      const start = new Date();
      start.setDate(today.getDate() - 29);
      setStartDate(formatDate(start));
      setEndDate(formatDate(today));
    }
  }, [range]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!user || !startDate || !endDate) return;

    const fetchMetrics = async () => {
      setSleepData([]);
      setExerciseData([]);
      setWellnessData([]);
      setNutritionData([]);

      const query = `https://func-vitametrics.azurewebsites.net/api/metrics?user_id=${user.id}&start_date=${startDate}&end_date=${endDate}&_=${Date.now()}`;

      const res = await fetch(query);
      const data = await res.json();

      const latestByDate = new Map<string, any>();

      data.forEach((item: any) => {
        if (!item.date) return;
        const normalizedDate = item.date.split("T")[0];

        const existing = latestByDate.get(normalizedDate);
        if (!existing || item._ts > existing._ts) {
          latestByDate.set(normalizedDate, item);
        }
      });

      const dateRange = buildDateRange(startDate, endDate);

      let protein = 0;
      let carbs = 0;
      let fat = 0;

      const sleep = dateRange.map((date) => {
        const item = latestByDate.get(date);

        return {
          date,
          label: formatMMDD(date),
          hours: item?.sleep?.hours || 0,
          quality: item?.sleep?.quality || 0
        };
      });

      const exercise = dateRange.map((date) => {
        const item = latestByDate.get(date);

        const matchesExercise =
          item?.exercise &&
          (exerciseType === "all" || item.exercise.type === exerciseType);

        return {
          date,
          label: formatMMDD(date),
          hours: matchesExercise ? item.exercise.hours || 0 : 0,
          type: item?.exercise?.type || ""
        };
      });

      const wellness: any[] = [];

      dateRange.forEach((date) => {
        const item = latestByDate.get(date);

        if (item?.nutrition) {
          protein += item.nutrition.protein || 0;
          carbs += item.nutrition.carbs || 0;
          fat += item.nutrition.fat || 0;
        }

        if (item?.wellness) {
          wellness.push({
            date,
            sleep: item.sleep?.hours || 0,
            exercise: item.exercise?.hours || 0,
            mood: item.wellness.mood || 0,
            stress: item.wellness.stress || 0
          });
        }
      });

      setSleepData(sleep);
      setExerciseData(exercise);
      setWellnessData(wellness);

      setNutritionData([
        { name: "Protein", value: protein },
        { name: "Carbs", value: carbs },
        { name: "Fat", value: fat }
      ]);
    };

    fetchMetrics();
  }, [user, range, startDate, endDate, exerciseType]);

  return (
    <div className="flex min-h-screen bg-black text-white text-sm">
      <div className="w-60 bg-gray-900/70 border-r border-gray-800 p-5 flex flex-col gap-5">
        <div className="flex flex-col items-center -mt-10 -mb-10">
            <Link to="/" className="hover:opacity-80 transition cursor-pointer">
              <Logo size="xl" />
            </Link>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {[
            { path: "dashboard", label: "Dashboard" },
            { path: "goals", label: "Goals" }, 
            { path: "logmetrics", label: "Log Metrics" },
            { path: "files", label: "Files" },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${
                  isActive
                    ? "bg-gray-300 text-black font-semibold"
                    : "text-gray-400 hover:text-white font-semibold"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-9">
        <div className="flex justify-between items-center mb-2 pb-2">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400 text-s mt-1">{currentDate}</p>
            <p className="text-gray-500 text-xs mt-4">
              Visualize your health trends across different metrics over time
            </p>
          </div>

          <div className="flex items-center gap-8 -mt-10">
            <div className="flex items-center gap-2 text-s">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="bg-gray-800 px-2 py-1 rounded-2xl"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="custom">Custom</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setRange("custom");
                }}
                className="bg-gray-800 px-2 py-1 rounded-2xl"
              />

              <span>-</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setRange("custom");
                }}
                className="bg-gray-800 px-2 py-1 rounded-2xl"
              />
            </div>

            <div
              className="relative z-50"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <span>{firstName}</span>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {firstName[0]}
                </div>
              </div>

              {menuOpen && (
                <div className="absolute right-0 top-full pt-1 w-40 z-50">
                  <div className="bg-gray-900 border rounded">
                    <button
                      onClick={handleLogout}
                      className="w-full p-2 text-left text-red-400 hover:bg-gray-800 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between mb-3 font-semibold">
              <h2>Sleep</h2>
              <select
                onChange={(e) => setSleepMetric(e.target.value)}
                className="bg-gray-800 px-2 py-1 rounded-2xl text-s"
              >
                <option value="hours">Hours</option>
                <option value="quality">Quality</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sleepData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <XAxis
                  dataKey="label"
                  interval={range === "30" ? 4 : 0}
                  label={{ value: "Date", position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  label={{
                    value: sleepMetric === "hours" ? "Hours" : "Quality",
                    angle: -90,
                    position: "insideLeft"
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => [
                    value,
                    `${formatMMDD(props.payload.date)} (${name})`
                  ]}
                />
                <Line dataKey={sleepMetric} stroke="#bfd06a" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl">
            <h2 className="mb-3 font-semibold">Nutrition</h2>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={60}
                  labelLine={true}
                  label={({ cx, cy, midAngle, outerRadius, name, value }) => {
                    const RADIAN = Math.PI / 180;
                    const x = cx + (outerRadius + 25) * Math.cos(-midAngle * RADIAN);
                    const y = cy + (outerRadius + 25) * Math.sin(-midAngle * RADIAN);

                    return (
                      <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} fill="#8f8f8f" fontSize={12}>
                        <tspan x={x} dy="0">{name}</tspan>
                        <tspan x={x} dy="14">{value}</tspan>
                      </text>
                    );
                  }}
                >
                  {nutritionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between mb-3 font-semibold">
              <h2>Exercise</h2>
              <select
                onChange={(e) => setExerciseType(e.target.value)}
                className="bg-gray-800 px-2 py-1 rounded-2xl text-s"
              >
                <option value="all">All</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={exerciseData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <XAxis
                  dataKey="label"
                  interval={range === "30" ? 4 : 0}
                  label={{ value: "Date", position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft"
                  }}
                />
                <Tooltip
                  cursor={false}
                  formatter={(value: any, name: any, props: any) => [
                    value,
                    `${formatMMDD(props.payload.date)} (${name})`
                  ]}
                />
                <Bar dataKey="hours" fill="#6aaed0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl">
            <div className="flex gap-2 mb-3 font-semibold">
              <h2 className="mr-2">Wellness</h2>
              <select onChange={(e)=>setWellnessX(e.target.value)} className="bg-gray-800 px-2 py-1 text-s rounded-2xl">
                <option value="sleep">Sleep</option>
                <option value="exercise">Exercise</option>
              </select>

              <select onChange={(e)=>setWellnessY(e.target.value)} className="bg-gray-800 px-2 py-1 text-s rounded-2xl">
                <option value="mood">Mood</option>
                <option value="stress">Stress</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <XAxis
                  type="number"
                  dataKey={wellnessX}
                  label={{ value: wellnessX, position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey={wellnessY}
                  label={{
                    value: wellnessY,
                    angle: -90,
                    position: "insideLeft"
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => [
                    value,
                    `${name} (${formatMMDD(props.payload.date)})`
                  ]}
                />
                <Scatter data={wellnessData} fill="#2f98bc" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}