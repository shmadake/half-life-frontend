import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking what you learn."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" type="text" value={name} onChange={setName} />
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
          Create account
        </button>
      </form>

      {error && (
        <p className="text-fade text-sm mt-3">
          {error}
          {error.toLowerCase().includes("log in") && (
            <>
              {" "}
              <Link to="/login" className="text-fresh hover:underline">
                Go to login
              </Link>
            </>
          )}
        </p>
      )}

      <p className="text-muted text-sm mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-fresh hover:underline">
          Log in
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

export default Register;
