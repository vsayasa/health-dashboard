import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    else {
    console.log("works");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      
      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] bg-lime-300/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-sky-400/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-800">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-center mb-2">
          <span className="text-lime-200">Vita</span>
          <span className="text-sky-300">Metrics</span>
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Sign in to your health dashboard
        </p>

        {/* Error */}
        {errorMsg && (
          <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lime-300 to-sky-400 hover:opacity-90 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-sky-400 cursor-pointer hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}