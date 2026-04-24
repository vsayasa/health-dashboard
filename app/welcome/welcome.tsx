import { Link } from "react-router";

export function Welcome() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden px-4">

      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-10">

        {/* Logo / Title */}
        <h1 className="text-5xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <p className="text-gray-400 max-w-xl">
          Track your health, visualize your habits, and optimize your daily performance —
          all in one dashboard.
        </p>

        {/* Card */}
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">

          <p className="text-gray-300 mb-6">
            Get started with your account
          </p>

          <div className="flex flex-col gap-4">

            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-black font-semibold py-2 rounded-lg transition hover:opacity-90"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
            >
              Create Account
            </Link>

            <Link
              to="/dashboard"
              className="w-full text-sm text-gray-400 hover:text-white transition underline mt-2"
            >
              Go to Dashboard →
            </Link>

          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-600 text-sm">
          Built for smarter health tracking
        </p>
      </div>
    </main>
  );
}