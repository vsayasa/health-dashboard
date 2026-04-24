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

export default function Dashboard() {

  const sleepData = [
    { day: "Mon", hours: 5 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 7 },
    { day: "Thu", hours: 6 },
    { day: "Fri", hours: 7 },
    { day: "Sat", hours: 8 },
    { day: "Sun", hours: 8 },
  ];

  const exerciseData = [
    { day: "Mon", hours: 1 },
    { day: "Tue", hours: 2 },
    { day: "Wed", hours: 1 },
    { day: "Thu", hours: 2 },
    { day: "Fri", hours: 1 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

  const nutritionData = [
    { name: "Protein", value: 30 },
    { name: "Carbs", value: 50 },
    { name: "Fat", value: 20 },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  const wellnessData = [
    { sleep: 5, mood: 2 },
    { sleep: 6, mood: 3 },
    { sleep: 7, mood: 4 },
    { sleep: 8, mood: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col gap-6 relative z-10">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-3 mt-6">
          <button className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-full text-left font-medium">
            Dashboard
          </button>
          <button className="text-gray-400 hover:text-white text-left transition">Log Metrics</button>
          <button onClick={() => navigate("/goals")}className="text-gray-400 hover:text-white text-left transition">Goals</button>
          <button className="text-gray-400 hover:text-white text-left transition">Files</button>

        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Health Overview</h1>
            <p className="text-gray-400">March 28, 2026</p>
          </div>

          <div className="flex gap-3 items-center">
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">Time Range</button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">Date</button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition">Reset</button>
            <div className="ml-4 text-gray-400">Welcome, User!</div>
          </div>
        </div>

        {/* GRID */}
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
                    {nutritionData.map((entry, index) => (
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

          {/* CALORIES */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Calories</h2>
            <p className="text-3xl mt-2 font-semibold">2400 cal</p>
          </div>

          {/* WEIGHT */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl text-center">
            <h2 className="text-gray-400">Weight</h2>
            <p className="text-3xl mt-2 font-semibold">120 lbs</p>
          </div>

        </div>
      </div>
    </div>
  );
}