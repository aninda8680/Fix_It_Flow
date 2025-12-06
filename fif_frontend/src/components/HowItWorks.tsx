import { motion } from "framer-motion";

const steps = [
  {
    title: "Upload a Photo",
    desc: "Take or upload a picture of the issue."
  },
  {
    title: "AI Analyzes the Problem",
    desc: "Detects issue type + extracts its location."
  },
  {
    title: "We Alert Authorities",
    desc: "Automatically sends issue to the respective ward."
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full overflow-y-hidden overflow-x-hidden bg-gray-50 py-20">
      <h2 className="text-center text-4xl font-bold mb-12">How It Works</h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-zinc-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
