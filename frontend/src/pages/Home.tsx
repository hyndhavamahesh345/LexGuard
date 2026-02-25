import { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Search,
  Globe
} from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleEnterCompliance = useCallback(() => {
    if (auth.isAuthenticated()) {
      navigate("/dashboard");
    } else {
      navigate("/login", { state: { afterLogin: "/dashboard" } });
    }
  }, [navigate, auth]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-slate-100 rounded-full text-slate-500">
              Introducing LexGuard AI 2.0
            </span>
            <h1 className="text-6xl md:text-[84px] font-semibold tracking-tight leading-[1.05] mb-8">
              Compliance. <br />
              <span className="text-[#86868b]">Reimagined with AI.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#86868b] mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the future of financial regulation. Automated GST and TDS validation with the precision of a thousand experts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="h-14 px-10 rounded-full bg-black text-white hover:bg-black/90 text-lg font-semibold transition-transform hover:scale-105 active:scale-95"
                onClick={handleEnterCompliance}
              >
                Start Free Check
              </Button>
              <Link to="/about" className="group text-lg font-semibold flex items-center gap-1 hover:text-[#06c] transition-colors">
                Learn how it works
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 max-w-5xl mx-auto relative px-4"
        >
          <div className="apple-shadow rounded-[2rem] bg-gradient-to-b from-[#f5f5f7] to-white p-2 border border-slate-200 aspect-video flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-white rounded-[1.8rem] flex flex-col p-8 relative">
              {/* Mock UI elements */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="w-48 h-2 bg-slate-100 rounded-full ml-4" />
              </div>
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-slate-50 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-6">
                  <div className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
                  <div className="h-32 bg-slate-50 rounded-2xl animate-pulse delay-75" />
                  <div className="h-32 bg-slate-50 rounded-2xl animate-pulse delay-150" />
                </div>
                <div className="h-40 w-full bg-black/5 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                  <ShieldCheck size={48} className="text-black opacity-10" />
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 right-12 glass apple-shadow px-6 py-4 rounded-3xl flex items-center gap-4 border-slate-200"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Compliant</h4>
                  <p className="text-xs text-[#86868b]">Verified via AI Agent 4</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-32 bg-[#F5F5F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <Feature
              icon={<Zap className="text-[#06c]" />}
              title="Instant Analysis"
              desc="Our proprietary AI agents process complex tax laws in milliseconds, not hours."
            />
            <Feature
              icon={<Lock className="text-[#06c]" />}
              title="Private by Design"
              desc="Your financial data never leaves our secure perimeter. Privacy is not an option; it's our standard."
            />
            <Feature
              icon={<Search className="text-[#06c]" />}
              title="Explainable Logic"
              desc="No black boxes. LexGuard provides clear, plain-English reasoning for every decision."
            />
          </div>
        </div>
      </section>

      {/* ================= PRODUCT DISPLAY ================= */}
      <section className="py-40 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-semibold tracking-tight mb-8 leading-tight">
              A regulatory expert <br /> for every transaction.
            </h2>
            <p className="text-lg text-[#86868b] leading-relaxed mb-10 font-medium">
              Manual law reviews are a thing of the past. LexGuard connects directly to official legal databases, mapping every clause to your specific financial context.
            </p>
            <ul className="space-y-4">
              {['Automated Section Mapping', 'Real-time Threshold Monitoring', 'Audit-ready Documentation'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-semibold text-lg">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-black">
                    <CheckCircle2 size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="glass apple-shadow p-6 rounded-[2rem] aspect-square flex flex-col justify-between">
                <Globe size={32} className="text-[#06c]" />
                <h3 className="font-bold text-xl">Global <br /> Standards</h3>
              </div>
              <div className="bg-black text-white p-6 rounded-[2rem] aspect-square flex flex-col justify-between">
                <ShieldCheck size={32} className="text-white" />
                <h3 className="font-bold text-xl">Bank-Grade <br /> Security</h3>
              </div>
            </div>
            <div className="space-y-6">
              <div className="apple-shadow bg-[#f5f5f7] p-6 rounded-[2rem] aspect-square flex flex-col justify-between border border-slate-200">
                <Zap size={32} className="text-amber-500" />
                <h3 className="font-bold text-xl">Real-time <br /> Updates</h3>
              </div>
              <div className="glass apple-shadow p-6 rounded-[2rem] aspect-square flex flex-col justify-between border-slate-200">
                <Users size={32} className="text-purple-500" />
                <h3 className="font-bold text-xl">Team <br /> Support</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-40 bg-black text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-10">Compliance at your <br /> fingertips.</h2>
          <Button
            size="lg"
            className="h-16 px-12 rounded-full bg-white text-black hover:bg-white/90 text-xl font-bold transition-transform hover:scale-105"
            onClick={handleEnterCompliance}
          >
            Get Started Now
          </Button>
          <p className="mt-8 text-[#86868b] font-medium tracking-tight">
            Free for teams up to 5 members. No credit card required.
          </p>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-slate-100 text-center text-sm text-[#86868b] font-medium">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-black text-lg">
            <ShieldCheck size={24} /> LexGuard AI
          </div>
          <p>© 2026 LexGuard Corporation. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ---------------------- COMPONENTS ---------------------- */

const Feature = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col">
    <div className="w-12 h-12 mb-6 flex items-center justify-center bg-white rounded-2xl apple-shadow">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-4 tracking-tight">{title}</h3>
    <p className="text-[#86868b] leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

const Users = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
