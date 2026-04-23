import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
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
          <div className="col-span-2 bg-gray-800 p-6 rounded-2xl">
            <h2 className="mb-2">Sleep</h2>
            <LineChart width={400} height={200} data={sleepData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#4ade80" />
            </LineChart>
          </div>

          {/* NUTRITION (placeholder) */}
          <div className="bg-gray-800 p-6 rounded-2xl">
            Nutrition Chart
          </div>

          {/* EXERCISE */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-2xl">
            <h2 className="mb-2">Exercise</h2>
            <BarChart width={400} height={200} data={exerciseData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#60a5fa" />
            </BarChart>
          </div>

          {/* WELLNESS (placeholder) */}
          <div className="bg-gray-800 p-6 rounded-2xl">
            Wellness Chart
          </div>

          {/* CALORIES */}
          <div className="bg-gray-800 p-6 rounded-2xl">
            <h2 className="text-gray-400">Calories</h2>
            <p className="text-3xl mt-2">2400 cal</p>
          </div>

          {/* WEIGHT */}
          <div className="bg-gray-800 p-6 rounded-2xl">
            <h2 className="text-gray-400">Weight</h2>
            <p className="text-3xl mt-2">120 lbs</p>
          </div>

        </div>
      </div>
    </div>
  );
}