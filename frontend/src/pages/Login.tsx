import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ShieldCheck } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: call your auth API here and get a real token
      // const { token } = await api.login({ email, password });
      // auth.login(email, token);

      // Simulated login (replace with real)
      await new Promise((res) => setTimeout(res, 600));
      auth.login(email, "server-returned-token-or-demo-token");

      // After successful login go to Home ("/") so user can click Enter Compliance
      // (or you can navigate directly to /dashboard if you prefer)
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed", err);
      // show error to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-500 mt-2">Sign in to your compliance dashboard</p>
        </div>

        <Card className="bg-white shadow-xl border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full h-10 border rounded px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full h-10 border rounded px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don’t have an <strong>account</strong>?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};