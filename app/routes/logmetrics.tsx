import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

export default function LogMetrics() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    sleepHours: "",
    sleepQuality: "",
    exerciseType: "cardio",
    exerciseHours: "",
    mood: "",
    stress: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const payload = {
      user_id: user.id,
      date: form.date,
      sleep: {
        hours: Number(form.sleepHours),
        quality: Number(form.sleepQuality)
      },
      exercise: {
        type: form.exerciseType,
        hours: Number(form.exerciseHours)
      },
      wellness: {
        mood: Number(form.mood),
        stress: Number(form.stress)
      },
      nutrition: {
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat)
      }
    };

    const res = await fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (res.ok) {
      navigate("/dashboard");
    } else {
      alert("Error saving metrics");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR (same as dashboard) */}
      <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-3 mt-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/logmetrics"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            Log Metrics
          </NavLink>

          <NavLink
            to="/files"
            className="text-gray-400 hover:text-white px-4 py-2"
          >
            Files
          </NavLink>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-semibold mb-6">Log Metrics</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* DATE */}
          <div className="col-span-2">
            <label className="text-gray-400 text-sm">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 rounded mt-1"
            />
          </div>

          {/* SLEEP */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h2 className="mb-2 font-semibold">Sleep</h2>
            <input name="sleepHours" placeholder="Hours" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
            <input name="sleepQuality" placeholder="Quality (1-5)" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          </div>

          {/* EXERCISE */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h2 className="mb-2 font-semibold">Exercise</h2>
            <select name="exerciseType" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2">
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
            </select>
            <input name="exerciseHours" placeholder="Hours" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          </div>

          {/* WELLNESS */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h2 className="mb-2 font-semibold">Wellness</h2>
            <input name="mood" placeholder="Mood (1-5)" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
            <input name="stress" placeholder="Stress (1-5)" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          </div>

          {/* NUTRITION */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h2 className="mb-2 font-semibold">Nutrition</h2>
            <input name="calories" placeholder="Calories" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
            <input name="protein" placeholder="Protein" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
            <input name="carbs" placeholder="Carbs" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
            <input name="fat" placeholder="Fat" onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          </div>

          {/* SUBMIT */}
          <div className="col-span-2">
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-black py-2 rounded font-semibold"
            >
              {loading ? "Saving..." : "Submit Metrics"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}