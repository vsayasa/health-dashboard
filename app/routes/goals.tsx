import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, NavLink, Link } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Logo from "../components/ui/Logo";

export default function Goals() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [totals, setTotals] = useState({
    sleep: 0,
    exercise: 0,
    nutrition: 0
  });

  const [goals, setGoals] = useState({
    sleep: 0,
    exercise: 0,
    nutrition: 0
  });

  const [form, setForm] = useState({
    sleep: "",
    exercise: "",
    nutrition: "",
    start_date: today,
    end_date: today
  });

  const [saving, setSaving] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
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

  const getPercent = (value: number, goal: number) => {
    if (!goal) return 0;
    return Math.min(Math.round((value / goal) * 100), 100);
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

  const fetchMetrics = async () => {
    if (!user || !form.start_date || !form.end_date) return;

    const res = await fetch(
      `https://func-vitametrics.azurewebsites.net/api/metrics?user_id=${user.id}&start_date=${form.start_date}&end_date=${form.end_date}&_=${Date.now()}`
    );

    const data = await res.json();

    let totalSleep = 0;
    let totalExercise = 0;
    let totalNutrition = 0;

    data.forEach((item: any) => {
      totalSleep += item.sleep?.hours || 0;
      totalExercise += item.exercise?.hours || 0;
      totalNutrition += item.nutrition?.protein || 0;
    });

    setTotals({
      sleep: Number(totalSleep.toFixed(1)),
      exercise: Number(totalExercise.toFixed(1)),
      nutrition: Number(totalNutrition.toFixed(1))
    });
  };

   const formatDateRange = (start: string, end: string) => {
        if (!start || !end) return "";

        const startDate = new Date(start);
        const endDate = new Date(end);

        const startFormatted = startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const endFormatted = endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return `${startFormatted} – ${endFormatted}`;
      };

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const res = await fetch(`https://func-vitametrics.azurewebsites.net/api/goals?user_id=${user.id}`);
      const data = await res.json();

      const nextGoals = {
        sleep: 0,
        exercise: 0,
        nutrition: 0
      };

      data.forEach((goal: any) => {
        if (goal.metric_type === "sleep") nextGoals.sleep = Number(goal.goal_value);
        if (goal.metric_type === "exercise") nextGoals.exercise = Number(goal.goal_value);
        if (goal.metric_type === "nutrition") nextGoals.nutrition = Number(goal.goal_value);
      });

      const firstGoal = data[0];

      setGoals(nextGoals);

      setForm((prev) => ({
        ...prev,
        sleep: nextGoals.sleep ? String(nextGoals.sleep) : "",
        exercise: nextGoals.exercise ? String(nextGoals.exercise) : "",
        nutrition: nextGoals.nutrition ? String(nextGoals.nutrition) : "",
        start_date: firstGoal?.start_date || prev.start_date,
        end_date: firstGoal?.end_date || prev.end_date || today
      }));

    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchGoals();
  }, [user]);

  useEffect(() => {
    if (!user || !form.start_date || !form.end_date) return;
    fetchMetrics();
  }, [user, form.start_date, form.end_date]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveGoal = async (
    metricType: "sleep" | "exercise" | "nutrition",
    value: string
  ) => {
    return fetch("https://func-vitametrics.azurewebsites.net/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        metric_type: metricType,
        goal_value: Number(value),
        start_date: form.start_date,
        end_date: form.end_date
      })
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    if (!form.sleep || !form.exercise || !form.nutrition || !form.start_date || !form.end_date) {
      alert("Please fill out all goal fields and date range.");
      return;
    }

    setSaving(true);

    try {
      await Promise.all([
        saveGoal("sleep", form.sleep),
        saveGoal("exercise", form.exercise),
        saveGoal("nutrition", form.nutrition)
      ]);

      setGoals({
        sleep: Number(form.sleep),
        exercise: Number(form.exercise),
        nutrition: Number(form.nutrition)
      });

      await fetchMetrics();
      await fetchGoals();
    } catch (error) {
      console.error("Error saving goals:", error);
      alert("Error saving goals");
    }

    setSaving(false);
  };

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
            { path: "files", label: "Files" }
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
        <div className="flex justify-between items-center mb-6 pb-2">
          <div>
            <h1 className="text-3xl font-semibold">Health Goal Tracker</h1>
            <p className="text-gray-400 mt-1">{currentDate}</p>
            <p className="text-gray-500 text-xs mt-4 -mb-4">
              Tracking goals from {formatDateRange(form.start_date, form.end_date)}
            </p>
          </div>

          <div
            className="relative z-50"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2 -mt-10 cursor-pointer">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Sleep", value: `${totals.sleep}h`, color: "border-[#bfd06a]" },
            { label: "Total Exercise", value: `${totals.exercise}h`, color: "border-[#75c091]" },
            { label: "Protein Intake", value: `${totals.nutrition}g`, color: "border-[#6aaed0]" },
            { label: "Status", value: overallPercent >= 75 ? "On Track" : "In Progress", color: "border-[#9087c9]" }
          ].map((stat, i) => (
            <div key={i} className={`bg-gray-900 p-4 rounded-2xl border-l-4 ${stat.color}`}>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-2xl">
            <h2 className="mb-4 font-semibold">Goal Progress</h2>

            {[
              { key: "sleep", label: "Sleep", unit: "h" },
              { key: "exercise", label: "Exercise", unit: "h" },
              { key: "nutrition", label: "Protein", unit: "g" }
            ].map((item: any) => {
              const current = totals[item.key as keyof typeof totals];
              const goal = goals[item.key as keyof typeof goals];
              const percent = getPercent(current, goal);

              return (
                <div key={item.key} className="mb-5">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span>{current}{item.unit} / {goal}{item.unit}</span>
                  </div>

                  <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-[#9087c9]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-gray-500 text-xs mt-1">{percent}% complete</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl flex flex-col items-center justify-center">
            <h2 className="mb-4 font-semibold">Goal Completion</h2>

            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#9087c9" />
                  <Cell fill="#1f2937" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <p className="text-2xl font-semibold -mt-2">{overallPercent}%</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded-2xl">
          <div className="mb-4">
            <h2 className="font-semibold">Set Goal Metrics</h2>
            <p className="text-gray-500 text-xs mt-1">
              Goals and stat totals are calculated using the selected date range.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs">Sleep Goal (hours)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                name="sleep"
                value={form.sleep}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#bfd06a]"
                placeholder="ex. 56"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs">Exercise Goal (hours)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                name="exercise"
                value={form.exercise}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6aaed0]"
                placeholder="ex. 5"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs">Protein Goal (grams)</label>
              <input
                type="number"
                min="0"
                step="1"
                name="nutrition"
                value={form.nutrition}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2f98bc]"
                placeholder="ex. 700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-gray-400 text-xs">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6aaed0]"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs">End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6aaed0]"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              disabled={saving}
              className="bg-[#bfd06a] hover:opacity-80 text-black px-6 py-2 rounded-full font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}