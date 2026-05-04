import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, NavLink, Link } from "react-router";
import Logo from "../components/ui/Logo";
import { getDisplayName } from "../utils/getDisplayName";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      setEmail(data.user.email || "");

      const name = getDisplayName(data.user);
      setDisplayName(name);
      setFirstName(name);
    };

    getUser();
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const updates: any = {
      email,
      data: {
        display_name: displayName,
      },
    };

    if (password.trim()) {
      updates.password = password;
    }

    const { data, error } = await supabase.auth.updateUser(updates);

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const updatedName = getDisplayName(data.user);
      setUser(data.user);
      setFirstName(updatedName);
      setDisplayName(updatedName);
    }

    setPassword("");
    setMessage("Profile updated successfully.");
  };

  return (
    <div className="flex min-h-screen bg-black text-white text-sm">
      {/* SIDEBAR */}
      <div className="w-60 bg-gray-900/70 border-r border-gray-800 p-5 flex flex-col gap-5">
        <div className="flex flex-col items-center -mt-10 -mb-10">
          <Link to="/" className="hover:opacity-80 transition cursor-pointer">
            <Logo size="xl" />
          </Link>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {[
            { path: "dashboard", label: "Dashboard" },
            { path: "logmetrics", label: "Log Metrics" },
            { path: "goals", label: "Goals" },
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

      {/* MAIN */}
      <div className="flex-1 p-9 flex flex-col items-center">
        <div className="w-full max-w-xl mb-6 text-center">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="text-gray-500 text-xs mt-2 -mb-2">
            Manage your account information and password
          </p>
        </div>

        <div className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-semibold">
              {firstName[0]}
            </div>

            <h2 className="text-xl font-semibold mt-3">{firstName}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>

          {message && (
            <div className="mb-4 bg-gray-800 text-gray-300 p-3 rounded-2xl text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-gray-400 text-xs">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#bfd06a]"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6aaed0]"
              />
            </div>

            <div>
                <label className="text-gray-400 text-xs">New Password</label>

                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 p-2 pr-12 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6aaed0]"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                    >
                    {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                </div>

            <div className="flex flex-col items-center gap-3 pt-3">
              <button
                disabled={saving}
                className="w-full max-w-xs bg-[#bfd06a] hover:opacity-80 text-black px-6 py-2 rounded-full font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full max-w-xs bg-red-400 hover:opacity-80 text-black px-6 py-2 rounded-full font-semibold"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}