"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Code2, ArrowRight, Sparkles } from "lucide-react";
import { ProfileFormData, APIResponse } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function AnalyzePage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    github: "",
    linkedin: "",
    leetcode: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

// Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

// Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitting:", formData);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: APIResponse = await response.json();
      localStorage.clear();
      localStorage.setItem("github", result.data.github);
      localStorage.setItem("linkedin", result.data.linkedin);
      localStorage.setItem("leetcode", result.data.leetcode||"");
      setTimeout(() => {
        toast.success("Profiles recorded successfully!");
      }, 2000);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative">
      <Toaster richColors position="top-right" />
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>
      <header className="sticky top-0 z-50 w-full border-b border-[#d9d2e9]/10 bg-[#1e0a3c]/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-[#d9d2e9]" />
              <span className="font-bold text-xl text-[#d9d2e9] sm:inline-block">
                DevProfiler
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-base font-medium">
              <Link
                href="/"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                How it works
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm mx-auto mb-4">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
                <span>Profile Analysis</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-[#d9d2e9] sm:text-4xl md:text-5xl relative">
                Analyze Your Developer Profile
                <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[#8a3ffc]/30 blur-xl"></div>
              </h1>
              <p className="text-[#d9d2e9]/90 md:text-xl">
                Connect your profiles to get a comprehensive analysis of your
                digital presence.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>
                <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>

                <CardHeader>
                  <CardTitle className="text-[#d9d2e9]">
                    Connect Your Profiles
                  </CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">
                    Enter your profile URLs to begin the analysis process.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <Label
                      htmlFor="github"
                      className="flex items-center gap-2 text-[#d9d2e9]"
                    >
                      <Github className="h-4 w-4" /> GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/username"
                      required
                      value={formData.github}
                      onChange={handleChange}
                      className="border-[#d9d2e9]/20 bg-white/10 text-[#d9d2e9] placeholder:text-[#d9d2e9]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2 text-[#d9d2e9]"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      required
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="border-[#d9d2e9]/20 bg-white/10 text-[#d9d2e9] placeholder:text-[#d9d2e9]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="leetcode"
                      className="flex items-center gap-2 text-[#d9d2e9]"
                    >
                      <Code2 className="h-4 w-4" /> LeetCode Profile
                    </Label>
                    <Input
                      id="leetcode"
                      placeholder="https://leetcode.com/username"
                      value={formData.leetcode}
                      onChange={handleChange}
                      className="border-[#d9d2e9]/20 bg-white/10 text-[#d9d2e9] placeholder:text-[#d9d2e9]/50"
                    />
                  </div>
                </CardContent>

                <CardFooter className="relative z-10">
                  <Button
                    type="submit"
                    className="w-full bg-[#8a3ffc] text-[#d9d2e9] hover:bg-[#9d5cff] relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analyzing Profiles...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        Start Analysis{" "}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
            <div className="text-center text-sm text-[#d9d2e9]/50">
              By connecting your profiles, you agree to our{" "}
              <Link
                href="#"
                className="text-[#8a3ffc] hover:text-[#9d5cff] underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-[#8a3ffc] hover:text-[#9d5cff] underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-[#d9d2e9]/10 py-6 bg-[#1e0a3c] relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#d9d2e9]/50 md:text-left">
            © 2025 DevProfiler. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
              Terms
            </Link>
            <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
              Privacy
            </Link>
            <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
