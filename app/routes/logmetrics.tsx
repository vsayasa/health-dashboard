import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, NavLink } from "react-router";

export default function LogMetrics() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    sleepHours: "",
    sleepQuality: "3",
    exerciseType: "cardio",
    exerciseHours: "",
    mood: "3",
    stress: "3",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });

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
    navigate("/login");
  };

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

  const ScaleSlider = ({
    label,
    name,
    value
  }: {
    label: string;
    name: string;
    value: string;
  }) => (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-gray-400 text-xs">{label}</label>
        <span className="text-sky-300 text-xs">{value}/5</span>
      </div>

      <input
        type="range"
        name={name}
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={handleChange}
        list={`${name}-ticks`}
        className="w-full accent-sky-300"
      />

      <datalist id={`${name}-ticks`}>
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="4" />
        <option value="5" />
      </datalist>

      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-black text-white text-sm">
      {/* SIDEBAR */}
      <div className="w-60 bg-gray-900/70 border-r border-gray-800 p-5 flex flex-col gap-5">
        <h1 className="text-xl font-bold">
          <span className="text-lime-200">Vita</span>
          <span className="text-sky-300">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-2 mt-4">
          {["dashboard", "logmetrics", "files"].map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${
                  isActive
                    ? "bg-gradient-to-r from-lime-300 to-sky-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {path === "dashboard"
                ? "Dashboard"
                : path === "logmetrics"
                ? "Log Metrics"
                : "Files"}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-2xl font-semibold">Log Metrics</h1>
            <p className="text-gray-400 text-xs">{currentDate}</p>
          </div>

          {/* PROFILE */}
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

        <form onSubmit={handleSubmit}>
          {/* DATE PICKER */}
          <div className="mb-4 flex items-center gap-2 text-xs">
            <label className="text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-gray-800 px-2 py-1 rounded text-xs w-36"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SLEEP */}
            <div className="bg-gray-900 p-4 rounded">
              <h2 className="mb-3 font-semibold">Sleep</h2>

              <input
                name="sleepHours"
                placeholder="Hours"
                value={form.sleepHours}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mb-4 text-sm"
              />

              <ScaleSlider
                label="Sleep Quality"
                name="sleepQuality"
                value={form.sleepQuality}
              />
            </div>

            {/* EXERCISE */}
            <div className="bg-gray-900 p-4 rounded">
              <h2 className="mb-3 font-semibold">Exercise</h2>

              <select
                name="exerciseType"
                value={form.exerciseType}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mb-2 text-sm"
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
              </select>

              <input
                name="exerciseHours"
                placeholder="Hours"
                value={form.exerciseHours}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded text-sm"
              />
            </div>

            {/* WELLNESS */}
            <div className="bg-gray-900 p-4 rounded">
              <h2 className="mb-3 font-semibold">Wellness</h2>

              <div className="space-y-5">
                <ScaleSlider label="Mood" name="mood" value={form.mood} />
                <ScaleSlider label="Stress" name="stress" value={form.stress} />
              </div>
            </div>

            {/* NUTRITION */}
            <div className="bg-gray-900 p-4 rounded">
              <h2 className="mb-3 font-semibold">Nutrition</h2>

              <input
                name="calories"
                placeholder="Calories"
                value={form.calories}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mb-2 text-sm"
              />

              <input
                name="protein"
                placeholder="Protein"
                value={form.protein}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mb-2 text-sm"
              />

              <input
                name="carbs"
                placeholder="Carbs"
                value={form.carbs}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mb-2 text-sm"
              />

              <input
                name="fat"
                placeholder="Fat"
                value={form.fat}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded text-sm"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="mt-5 flex justify-end">
            <button
              disabled={loading}
              className="bg-gradient-to-r from-lime-300 to-sky-400 text-black px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}