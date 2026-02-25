import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { ShieldCheck, ArrowRight, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post('http://localhost:8000/api/auth/google', {
        credential: credentialResponse.credential
      });

      const { token, user } = response.data;
      auth.login(user.email, token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Google login failed", err);
      setError("Google Client not configured. Please use Demo Access below.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Small delay for premium feel
      await new Promise((res) => setTimeout(res, 800));
      auth.login("demo@lexguard.ai", "demo-token");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Demo access failed. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((res) => setTimeout(res, 600));
      auth.login(email || "user@example.com", "demo-token");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-6 shadow-2xl"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <h2 className="text-4xl font-semibold tracking-tight text-black mb-3">Welcome to LexGuard</h2>
          <p className="text-[#86868b] text-lg font-medium">Apple-grade compliance for modern teams.</p>
        </div>

        <div className="glass apple-shadow rounded-[2.5rem] p-10 bg-white/80">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-rose-50 text-rose-600 text-sm rounded-2xl border border-rose-100 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* PRIMARY ACTION: DEMO LOGIN */}
            <div className="space-y-3">
              <Button
                type="button"
                className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 text-[16px] font-bold shadow-xl active:scale-[0.98] transition-all"
                onClick={handleDemoLogin}
                isLoading={isLoading}
              >
                <Sparkles className="mr-2 w-5 h-5 text-amber-400" />
                Quick Demo Access
              </Button>
              <p className="text-center text-[11px] text-[#86868b] font-bold uppercase tracking-widest">
                No credit card required
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-[#86868b]">
                <span className="bg-white/0 px-4">Development Options</span>
              </div>
            </div>

            {/* SECONDARY: GOOGLE LOGIN (FALLBACK) */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center w-full opacity-60 hover:opacity-100 transition-opacity">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("OAuth Error: 401 Invalid Client")}
                  useOneTap
                  theme="outline"
                  shape="pill"
                  text="continue_with"
                  width="100%"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-50">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  type="email"
                  placeholder="LexGuard ID / Email"
                  required
                  className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-[#86868b]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-[#86868b]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-[16px] font-semibold mt-2 transition-transform active:scale-[0.98]"
              >
                Sign In with ID
                <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Button>
            </form>
          </div>

          <footer className="mt-8 text-center text-[14px] text-[#86868b]">
            New to LexGuard?{" "}
            <Link to="/signup" className="text-black font-bold hover:underline underline-offset-4">
              Get Started
            </Link>
          </footer>
        </div>

        <p className="mt-12 text-center text-[11px] text-[#86868b] max-w-[300px] mx-auto leading-relaxed font-medium">
          Secure. Compliant. Private. <br />
          Built for the future of financial monitoring.
        </p>
      </motion.div>
    </div>
  );
};
