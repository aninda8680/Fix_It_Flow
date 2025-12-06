import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="w-full overflow-y-hidden overflow-x-hidden min-h-[80vh] flex flex-col items-center justify-center text-center bg-white "
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-bold text-zinc-900 mb-6"
      >
        Fix-It-Flow
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-lg text-zinc-600 max-w-xl"
      >
        Report civic issues like potholes, broken streetlights or drainage
        problems. Our AI detects the issue and automatically notifies the correct authority.
      </motion.p>

      <motion.a
        href="#upload"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-10 px-8 py-4 bg-black text-white rounded-xl hover:bg-zinc-800 transition text-lg"
      >
        Report an Issue →
      </motion.a>
    </section>
  );
}
