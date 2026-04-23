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

export default function Dashboard() {

  // Sleep Data
  const sleepData = [
    { day: "Mon", hours: 5 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 7 },
    { day: "Thu", hours: 6 },
    { day: "Fri", hours: 7 },
    { day: "Sat", hours: 8 },
    { day: "Sun", hours: 8 },
  ];

  // Exercise Data
  const exerciseData = [
    { day: "Mon", hours: 1 },
    { day: "Tue", hours: 2 },
    { day: "Wed", hours: 1 },
    { day: "Thu", hours: 2 },
    { day: "Fri", hours: 1 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

  // Nutrition Data
  const nutritionData = [
    { name: "Protein", value: 30 },
    { name: "Carbs", value: 50 },
    { name: "Fat", value: 20 },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  // Wellness Data
  const wellnessData = [
    { sleep: 5, mood: 2 },
    { sleep: 6, mood: 3 },
    { sleep: 7, mood: 4 },
    { sleep: 8, mood: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-4 mt-6">
          <button className="bg-gray-200 text-black px-4 py-2 rounded-full text-left">
            Dashboard
          </button>
          <button className="text-gray-400 text-left">Log Metrics</button>
          <button className="text-gray-400 text-left">Goals</button>
          <button className="text-gray-400 text-left">Files</button>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400">March 28, 2026</p>
          </div>

          <div className="flex gap-3 items-center">
            <button className="bg-gray-700 px-4 py-2 rounded-full">Time Range</button>
            <button className="bg-gray-700 px-4 py-2 rounded-full">Date</button>
            <button className="bg-gray-700 px-4 py-2 rounded-full">Reset</button>
            <div className="ml-4">Welcome, User!</div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* SLEEP */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-2xl h-[300px]">
            <h2 className="mb-2">Sleep</h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={sleepData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#4ade80"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* NUTRITION */}
          <div className="bg-gray-800 p-6 rounded-2xl h-[300px]">
            <h2 className="mb-2">Nutrition</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* EXERCISE */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-2xl h-[300px]">
            <h2 className="mb-2">Exercise</h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={exerciseData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar
                  dataKey="hours"
                  fill="#60a5fa"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* WELLNESS */}
          <div className="bg-gray-800 p-6 rounded-2xl h-[300px]">
            <h2 className="mb-2">Wellness</h2>

            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" dataKey="sleep" stroke="#ccc" />
                <YAxis type="number" dataKey="mood" stroke="#ccc" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={wellnessData} fill="#a78bfa" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* CALORIES */}
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Calories</h2>
            <p className="text-3xl mt-2">2400 cal</p>
          </div>

          {/* WEIGHT */}
          <div className="bg-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Weight</h2>
            <p className="text-3xl mt-2">120 lbs</p>
          </div>

        </div>
      </div>
    </div>
  );
}