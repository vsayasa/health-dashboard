import { Link } from "react-router";
import Logo from "../components/ui/Logo";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { getDisplayName } from "../utils/getDisplayName";

export function Welcome() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        setFirstName(getDisplayName(data.user));
      }
    };

    getUser();
  }, []);

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

          {user ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                Welcome, {firstName}
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Continue tracking your health insights
              </p>

              <Link
                to="/dashboard"
                className="w-full block bg-[#bfd06a] text-black font-semibold py-2 rounded-full transition hover:opacity-80"
              >
                Go to Dashboard →
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
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