import { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  FileText,
  Layers,
  GitMerge,
  CheckCircle2,
  MessageSquare,
  Users,
} from "lucide-react";

/* ---------------------- HOME PAGE ---------------------- */

export const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleEnterCompliance = useCallback(() => {
    if (auth.isAuthenticated()) {
      // user is signed in -> go to dashboard (changed per request)
      navigate("/dashboard");
    } else {
      // not signed in -> go to login, after login redirect to dashboard
      navigate("/login", { state: { afterLogin: "/dashboard" } });
    }
  }, [navigate, auth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#0E1630] to-[#0B1020] text-slate-200">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-28 pb-36">
        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-40 -right-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>

        {/* Top-right auth buttons inside hero */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-slate-900"
            >
              Sign In
            </Button>
          </Link>

          <Link to="/signup">
            <Button size="sm">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
              AI-Driven Compliance <br />
              <span className="text-indigo-400">
                Built for Clarity
              </span>
            </h1>

            <p className="text-slate-300 text-lg mb-10 max-w-xl">
              Lexguard-AI helps businesses and accountants validate financial transaction against defined GST and TDS rules with clear, explainable insights, reducing manual effort and audit risk.
            </p>

            <div className="flex gap-4">
              {/* Replaced Link with onClick handler to implement auth-aware flow */}
              <Button size="lg" className="h-12 px-8" onClick={handleEnterCompliance}>
                Enter Transaction details
              </Button>
            </div>

            {/* Stats Glass Panel */}
            <div className="mt-10 inline-flex gap-8 text-sm bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-6 py-4">
              <span>✔ 12 laws monitored</span>
              <span>✔ 3 amendments today</span>
              <span>✔ 27 checks automated</span>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="w-96 h-96 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-2xl">
              <ShieldCheck size={160} className="text-indigo-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPARISON ================= */}
      <section className="py-24 bg-gradient-to-b from-[#0E1630] to-[#0B1020]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <CompareCard
            title="Today's Reality"
            color="red"
            items={[
              "Manual PDF law reviews",
              "Missed amendments",
              "Slow compliance checks",
              "Late audit objections",
            ]}
          />
          <CompareCard
            title="With Lexguard-AI"
            color="green"
            items={[
              "Auto-updated laws",
              "AI clause mapping",
              "Instant validation",
              "Explainable decisions",
            ]}
          />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-[#0B1020] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14 text-white">
            How It Works
          </h2>

          <div className="grid md:grid-cols-5 gap-6 text-center">
            <Agent icon={FileText} title="Law Monitor" desc="Tracks official legal updates" />
            <Agent icon={Layers} title="Clause Engine" desc="Extracts legal clauses" />
            <Agent icon={GitMerge} title="Version Control" desc="Applies correct law versions" />
            <Agent icon={CheckCircle2} title="Compliance AI" desc="Validates transactions" />
            <Agent icon={MessageSquare} title="Explainability" desc="Plain-English reasoning" />
          </div>
        </div>
      </section>

      {/* ================= WHO WE HELP ================= */}
      <section className="py-24 bg-gradient-to-b from-[#0E1630] to-[#0B1020] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14 text-white">
            Who We Help
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <Role title="Pay & Accounts Officers" desc="Pre-payment compliance checks" />
            <Role title="Internal Auditors" desc="Audit-ready reports" />
            <Role title="Senior Officers" desc="Risk-only visibility" />
            <Role title="Oversight Teams" desc="Clause-linked audit trails" />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24 text-center overflow-hidden 
        bg-gradient-to-r from-[#0A1F44] via-[#0B2A5B] to-[#0C2F6D]">

        {/* Subtle blue glow (very controlled) */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] 
                        bg-blue-500/15 rounded-full blur-[160px]" />

        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] 
                        bg-indigo-500/15 rounded-full blur-[160px]" />

        {/* Soft focus light */}
        <div className="absolute inset-0 
                        bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_65%)]" />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-sm">
            Reduce Manual Compliance. Increase Trust.
          </h2>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="h-12 px-8 shadow-md" onClick={handleEnterCompliance}>
              Start Compliance Check
            </Button>

            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-white/30 text-white 
                          hover:bg-white/10 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ---------------------- COMPONENTS ---------------------- */

const CompareCard = ({
  title,
  color,
  items,
}: {
  title: string;
  color: "red" | "green";
  items: string[];
}) => (
  <div className="rounded-2xl p-8 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
    <h3
      className={`font-bold mb-6 text-xl ${color === "red" ? "text-red-400" : "text-green-400"
        }`}
    >
      {title}
    </h3>
    <ul className="space-y-3 text-left">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <CheckCircle2 size={18} className="text-slate-400" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Agent = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow hover:shadow-2xl transition">
    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-500/20 flex items-center justify-center">
      <Icon className="text-indigo-400" />
    </div>
    <h4 className="font-semibold text-white mb-1">{title}</h4>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

const Role = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => (
  <div className="rounded-2xl p-8 bg-white/5 backdrop-blur-lg border border-white/10 shadow">
    <Users className="mx-auto text-indigo-400 mb-4" size={32} />
    <h4 className="font-semibold text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);