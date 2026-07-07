import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, name, id } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("userId", id);

      navigate("/topics");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Pick up where you left off.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <button
          type="submit"
          className="bg-fresh text-ink font-semibold py-2.5 rounded-md mt-2 hover:opacity-90 transition"
        >
          Log in
        </button>
      </form>

      {error && <p className="text-fade text-sm mt-3">{error}</p>}

      <p className="text-muted text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-fresh hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="bg-surface border border-border rounded-md px-3 py-2.5 text-text
                   focus:outline-none focus:ring-2 focus:ring-fresh/50 focus:border-fresh"
      />
    </label>
  );
}

export default Login;
