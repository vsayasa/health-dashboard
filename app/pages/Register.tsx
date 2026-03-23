import { Link } from "react-router";
import { useState, useEffect } from "react";

export default function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // See if it works?
 console.log("Register attempt:", { username, password });
        setIsLoading(false);
        };


    return (
            <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="username"
              placeholder="Enter your username"
              value={username}
              style={{ color: "#000000" }}
              onChange={(e) => {
                const v = e.target.value;
                setUsername(v);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              style={{ color: "#000000" }}
              onChange={(e) => {
                const v = e.target.value;
                setPassword(v);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Already have an account? Login here.
          </Link>
        </form>
      </div>
    </div>
  );
  }