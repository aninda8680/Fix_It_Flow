import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  // ✅ Apply global theme silently
  useTheme();

  const navigate = useNavigate();
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGIN
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      login(data.token, data.user);
      navigate("/");
    }
  };

  // REGISTER
  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      // After successful registration, automatically log in the user
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        // Use the login function from AuthContext to properly set auth state
        login(loginData.token, loginData.user);
        navigate("/");
      }
    }
  };

  return (
    // <motion.div
    //   initial={{ opacity: 0, x: 60 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   exit={{ opacity: 0, x: -60 }}
    //   transition={{ duration: 0.4, ease: "easeInOut" }}
    //   className="min-h-screen"
    // >
    <div className="w-full overflow-x-hidden min-h-screen flex items-center justify-center px-6
      bg-gray-50 dark:bg-black transition-colors">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md shadow-xl rounded-2xl p-10 border
          bg-white text-black border-gray-200
          dark:bg-black dark:text-white dark:border-white/20
          transition-colors"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          {showRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">
          {showRegister
            ? "Register to start using Fix-It-Flow"
            : "Login to continue using Fix-It-Flow"}
        </p>

        {/* LOGIN FORM */}
        {!showRegister && (
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="text-left">
              <label className="block mb-1 font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl
                  border border-gray-300 dark:border-white/30
                  bg-white dark:bg-black
                  text-black dark:text-white
                  focus:outline-none focus:border-black dark:focus:border-white
                  transition"
              />
            </div>

            <div className="text-left">
              <label className="block mb-1 font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl
                  border border-gray-300 dark:border-white/30
                  bg-white dark:bg-black
                  text-black dark:text-white
                  focus:outline-none focus:border-black dark:focus:border-white
                  transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-lg font-medium
                bg-black text-white hover:bg-zinc-800
                dark:bg-white dark:text-black dark:hover:bg-zinc-200
                transition"
            >
              Login →
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
{showRegister && (
  <form className="space-y-6" onSubmit={handleRegister}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* LEFT COLUMN — First + Last Name */}
      <div className="space-y-6">
        {[
          ["firstName", "First Name"],
          ["lastName", "Last Name"],
        ].map(([field, label]) => (
          <div key={field} className="text-left">
            <label className="block mb-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
              {label}
            </label>
            <input
              name={field}
              type="text"
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg
                border border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                placeholder-zinc-400 dark:placeholder-zinc-500
                shadow-sm
                focus:outline-none
                focus:ring-2 focus:ring-black/80 dark:focus:ring-white/70
                transition-all
              "
            />
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN — Email / Password / Confirm Password */}
      <div className="space-y-6">
        {[
          ["email", "Email", "text"],
          ["password", "Password", "password"],
          ["confirmPassword", "Confirm Password", "password"],
        ].map(([field, label, type]) => (
          <div key={field} className="text-left">
            <label className="block mb-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
              {label}
            </label>
            <input
              name={field}
              type={type}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg
                border border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                placeholder-zinc-400 dark:placeholder-zinc-500
                shadow-sm
                focus:outline-none
                focus:ring-2 focus:ring-black/80 dark:focus:ring-white/70
                transition-all
              "
            />
          </div>
        ))}
      </div>
    </div>

    <button
      type="submit"
      className="
        w-full py-3 rounded-xl text-lg font-semibold
        bg-black text-white hover:bg-zinc-800
        dark:bg-white dark:text-black dark:hover:bg-zinc-300
        transition-all shadow
      "
    >
      Create Account →
    </button>
  </form>
)}



        <p className="text-center text-zinc-500 dark:text-zinc-400 mt-6 text-sm">
          {showRegister ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setShowRegister(false)}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
