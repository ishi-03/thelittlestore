import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await adminLogin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-5">Sign in to manage The Little Store</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2">{error}</div>
        )}

        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-pink-400"
        />

        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5 outline-none focus:border-pink-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white py-2.5 rounded-lg transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
