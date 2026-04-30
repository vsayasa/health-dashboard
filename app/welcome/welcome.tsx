import { Link } from "react-router";
import Logo from "../components/ui/logo";

export function Welcome() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden px-4">

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-5 -mt-20">

        {/* Logo / Title */}
        <Logo size="xxxl" />

        <p className="text-gray-400 font-semibold text-3xl -mt-23 mb-2">
          Personal Health Dashboard
        </p>

        {/* Card */}
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">

          <p className="text-gray-300 mb-6">
            Get started with your account
          </p>

          <div className="flex flex-col gap-4">

            <Link
              to="/login"
              className="w-full bg-[#bfd06a] text-black font-semibold py-2 rounded-full transition hover:opacity-80"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="w-full bg-[#6aaed0] text-black font-semibold py-2 rounded-full transition hover:opacity-80"
            >
              Signup
            </Link>


          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 max-w-xl -10mt">
          Track your health, visualize your habits, and optimize your daily performance —
          all in one dashboard.
        </p>

      </div>
    </main>
  );
}