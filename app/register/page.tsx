/* "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
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

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ThemeSwitcher />
        <h1 className="font-heading text-4xl text-text mb-2">Create account</h1>
        <p className="text-muted text-sm mb-8">Start shopping with us today</p>

        <div className="bg-surface border border-muted/20 rounded-2xl p-8 flex flex-col gap-5">
          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text text-sm font-medium">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
} */


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Password requirements
const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

// Checks how many requirements are met and returns a strength level
function getStrength(password: string): "weak" | "fair" | "strong" | "great" {
  const passed = requirements.filter((r) => r.test(password)).length;
  if (passed <= 1) return "weak";
  if (passed === 2) return "fair";
  if (passed === 3) return "strong";
  return "great";
}

// Maps strength level to a color
const strengthColor = {
  weak: "bg-red-500",
  fair: "bg-orange-400",
  strong: "bg-yellow-400",
  great: "bg-green-500",
};

// Maps strength level to bar width
const strengthWidth = {
  weak: "w-1/4",
  fair: "w-2/4",
  strong: "w-3/4",
  great: "w-full",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  
  // error holds a string message to show the user
  const [error, setError] = useState("");
  
  // loading prevents double submissions
  const [loading, setLoading] = useState(false);
  
  // showRequirements controls whether the password checklist is visible
  const [showRequirements, setShowRequirements] = useState(false);

  const strength = getStrength(form.password);
  const allPassed = requirements.every((r) => r.test(form.password));

  const handleSubmit = async () => {
    // Client-side validation before even hitting the API
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!allPassed) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Always try to parse the response as JSON
      // If the server returns HTML (like a 404 page), this will throw
      let data;
      try {
        data = await res.json();
      } catch {
        // This catches the "string did not match expected pattern" error
        // It means the server returned HTML instead of JSON (usually a 404 or 500)
        setError("Server error. Please try again later.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // Use the error message from the API if available
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      // This catches network errors (no internet, server down etc.)
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ThemeSwitcher />
        <h1 className="font-heading text-4xl text-text mb-2">Create account</h1>
        <p className="text-muted text-sm mb-8">Start shopping with us today</p>

        <div className="bg-surface border border-muted/20 rounded-2xl p-8 flex flex-col gap-5">
          
          {/* Error banner — only shows when error state is not empty */}
          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text text-sm font-medium">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

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
              // When user focuses the password field, show requirements
              onFocus={() => setShowRequirements(true)}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-bg border border-muted/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />

            {/* Password strength bar — only shows when user is typing */}
            {form.password.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {/* Strength bar */}
                <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]} ${strengthWidth[strength]}`}
                  />
                </div>
                {/* Strength label */}
                <p className="text-xs text-muted capitalize">
                  Password strength:{" "}
                  <span className="font-medium text-text">{strength}</span>
                </p>
              </div>
            )}

            {/* Requirements checklist — shows on focus */}
            {showRequirements && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {requirements.map((req) => {
                  const passed = req.test(form.password);
                  return (
                    <li
                      key={req.label}
                      className={`text-xs flex items-center gap-2 transition-colors ${
                        passed ? "text-green-500" : "text-muted"
                      }`}
                    >
                      {/* Checkmark or dot depending on whether requirement is met */}
                      <span>{passed ? "✓" : "○"}</span>
                      {req.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-accent text-bg font-medium py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}