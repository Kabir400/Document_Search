"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Card from "./ui/Card";
import Link from "next/link";

const AuthForm = ({ mode = "login" }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const apiEndpoint = isLogin
    ? "http://localhost:8000/api/v1/login"
    : "http://localhost:8000/api/v1/signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }


      // Save to localStorage
      localStorage.setItem("authToken", data?.data?.Token);
     

      // Redirect to home
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-black">
        {/* Background ambient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20" />
             <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-900/20" />
        </div>

      <Card className="z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to get started with our platform"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-zinc-500 dark:text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-medium text-black hover:underline dark:text-white"
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
