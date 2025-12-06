import { useState } from "react";
import { motion } from "framer-motion";

export default function UploadIssue() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <section
      id="upload"
      className="w-full overflow-y-hidden overflow-x-hidden py-24 bg-white text-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8"
      >
        Upload an Issue
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto p-8 border rounded-xl bg-gray-50 shadow-sm"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full mb-6"
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="w-full rounded-xl mb-6 shadow"
          />
        )}

        <button className="px-8 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition">
          Submit Issue
        </button>
      </motion.div>
    </section>
  );
}
