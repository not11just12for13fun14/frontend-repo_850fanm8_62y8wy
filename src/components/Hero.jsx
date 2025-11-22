import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm text-white/90 backdrop-blur-md">
            <span className="text-lg">🐬</span>
            <span>DOLPHIN AI</span>
          </div>
          <h1 className="mt-5 text-5xl sm:text-6xl font-black tracking-tight">
            Create. Chat. Imagine.
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            Your all-in-one AI studio to converse like GPT-4, generate stunning images, and talk in a natural female voice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#studio" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:shadow-xl transition">Open Studio</a>
            <a href="#how" className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition">How it works</a>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25),transparent_40%)]" />
    </section>
  );
}
