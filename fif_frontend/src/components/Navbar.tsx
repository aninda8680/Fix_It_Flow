"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed top-0 left-0 bg-white/70 backdrop-blur-md shadow-sm z-50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900">Fix-It-Flow</h1>

        <div className="space-x-6 text-zinc-700 font-medium">
          <Link to="/">Home</Link>
          <Link to="#upload">Report Issue</Link>
          <Link to="/auth">Login</Link>
        </div>
      </div>
    </motion.nav>
  );
}
