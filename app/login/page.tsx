"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-4xl text-text mb-2">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Sign in to your account</p>

        <div className="bg-surface border border-muted/20 rounded-2xl p-8 flex flex-col gap-5">
          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-accent text-bg font-medium py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="text-muted text-sm text-center mt-6">
          Dont have an account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}