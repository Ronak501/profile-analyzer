import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
      <header className="w-full border-b border-white/10 bg-transparent backdrop-blur-sm">
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
                href="#features"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                How it works
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-10 xl:py-10 relative overflow-hidden">
          {/* Spotlight effects */}
          <div className="absolute -top-20 -left-20 h-32 w-32 rounded-full bg-[#8a3ffc] blur-3xl"></div>
          {/* <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div> */}
          <div className="absolute -top-20 -right-20 h-32 w-32 rounded-full bg-[#8a3ffc] blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2 text-center lg:text-left">
                  <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm mb-4">
                    <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc] " />
                    <p>AI-Powered Analysis</p>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter text-[#d9d2e9] sm:text-5xl xl:text-6xl/none">
                    <span className="block relative ">
                      AI-Powered Digital Profile Analyzer – Elevate Your Tech
                      Presence
                      <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[#8a3ffc]/30 blur-xl"></div>
                    </span>
                    <span className="block">
                      <span className="italic font-normal">In</span>{" "}
                      <span className=" opacity-50">MINUTES</span>
                      <span className="italic font-normal">not</span>{" "}
                      <span className="line-through ">HOURS</span>
                    </span>
                  </h1>
                  <div className="relative max-w-[700px] mx-auto lg:mx-0 mt-4">
                    <p className="text-[#d9d2e9] text-opacity-90 md:text-xl relative z-10">
                      In today's competitive job market, your digital footprint matters. 
                      Our AI-driven analyzer evaluates your GitHub, LinkedIn, and coding 
                      platform activity to provide a comprehensive profile score, 
                      actionable insights, and personalized career recommendations. 
                      Optimize your presence and stand out to recruiters effortlessly!
                    </p>
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 h-16 w-16 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#8a3ffc] text-[#d9d2e9] hover:bg-white hover:text-[#8a3ffc] relative overflow-hidden group"
                  >
                    <Link href="/analyze">
                      <span className="relative z-10 flex items-center">
                        Analyze Your Profile{" "}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto lg:mr-0 mt-8 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/20 to-transparent blur-3xl rounded-full transform scale-150 opacity-30"></div>
                <div className="relative z-10 bg-white rounded-3xl p-6 shadow-xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2012_30_02%20AM-6xz4YjqNcJHcurc47yiI8ySmG2stK7.png"
                    alt="Developer profile analysis illustration"
                    width={425}
                    height={425}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#8a3ffc]/30 blur-xl"></div>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#8a3ffc]/30 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-8">
          <div className="container px-4">
            <div className="rounded-2xl border border-[#d9d2e9]/10 bg-[#8a3ffc]/5 backdrop-blur-sm p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
              {/* <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>
              <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div> */}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8a3ffc]/20">
                  <Star className="h-5 w-5 text-[#8a3ffc]" />
                </div>
                <p className="text-[#d9d2e9] font-medium">
                  <span className="font-bold">New!</span> Blogs on New Ways to
                  how to enhance your digital tech presence of your profile in
                  this compititive world
                </p>
              </div>
              <Button
                asChild
                className="bg-[#8a3ffc]/20 text-[#d9d2e9] border border-[#d9d2e9]/20  hover:bg-white hover:text-[#301755] "
              >
                <Link
                  href="https://www.rcl.ac.uk/news/enhance-online-presence-job-search/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-20 bg-[#1e0a3c]/80 relative"
        >
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
                <span>Powerful Features</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#d9d2e9] md:text-4xl/tight">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-[#d9d2e9]/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides comprehensive analysis of your digital
                  presence across multiple platforms.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Data Aggregation
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  Automatically scrapes and verifies data from GitHub, LinkedIn,
                  Codeforces, and other coding platforms.
                </p>
              </div>
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Profile Scoring
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  Analyzes coding contributions, project diversity,
                  problem-solving skills, and professional engagement.
                </p>
              </div>
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Insight Generation
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  Provides a detailed breakdown of strengths, weaknesses, and
                  actionable recommendations.
                </p>
              </div>
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Recruiter Readiness
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  Generates a hiring potential score to help users optimize
                  their digital presence for recruiters.
                </p>
              </div>
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Peer Comparison
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  Allows users to benchmark their profile against top developers
                  and peers in their field.
                </p>
              </div>
              <div className="rounded-xl border border-[#d9d2e9]/10 bg-white/5 p-6 backdrop-blur-sm relative group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Career Pathways
                </h3>
                <p className="mt-2 text-[#d9d2e9]/90">
                  AI-generated career recommendations based on your profile and
                  industry trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-8">
          <div className="container px-4">
            <div className="rounded-2xl border border-[#d9d2e9]/10 bg-[#8a3ffc]/5 backdrop-blur-sm p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>
              <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-[#8a3ffc]/20 blur-xl"></div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8a3ffc]/20">
                  <Sparkles className="h-5 w-5 text-[#8a3ffc]" />
                </div>
                <p className="text-[#d9d2e9] font-medium">
                  <span className="font-bold">Limited Time Offer!</span> Get a
                  free profile analysis with our highly accurate Profile
                  Analyzer. Gain deep insights into your coding contributions,
                  professional engagement, and recruiter readiness to enhance
                  your digital presence effortlessly!
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-[#8a3ffc]/20 text-[#d9d2e9] border border-[#d9d2e9]/20  hover:bg-white hover:text-[#301755] relative  group"
              >
                <Link href="/analyze">
                  <span className="relative z-10 flex items-center">
                    Analyze Your Profile{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-20 bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative"
        >
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>
          <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
                <span>Simple Process</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#d9d2e9] md:text-4xl/tight">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-[#d9d2e9]/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses AI to analyze your digital presence and
                  provide actionable insights.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8a3ffc] text-3xl font-bold text-[#d9d2e9] relative">
                  <span className="relative z-10">1</span>
                  <div className="absolute inset-0 rounded-full bg-[#8a3ffc]/50 blur-md"></div>
                </div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Connect Your Profiles
                </h3>
                <p className="text-[#d9d2e9]/90">
                  Link your GitHub, LinkedIn, and coding platform profiles to
                  our system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8a3ffc] text-3xl font-bold text-[#d9d2e9] relative">
                  <span className="relative z-10">2</span>
                  <div className="absolute inset-0 rounded-full bg-[#8a3ffc]/50 blur-md"></div>
                </div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  AI Analysis
                </h3>
                <p className="text-[#d9d2e9]/90">
                  Our AI analyzes your contributions, engagement, and skills
                  across platforms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8a3ffc] text-3xl font-bold text-[#d9d2e9] relative">
                  <span className="relative z-10">3</span>
                  <div className="absolute inset-0 rounded-full bg-[#8a3ffc]/50 blur-md"></div>
                </div>
                <h3 className="text-xl font-bold text-[#d9d2e9]">
                  Get Insights
                </h3>
                <p className="text-[#d9d2e9]/90">
                  Receive detailed reports with actionable recommendations to
                  improve your profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-20 relative">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>
          <div className="absolute inset-0 bg-[#1e0a3c]/80"></div>
          <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
                <span>Get Started Today</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#d9d2e9] md:text-4xl/tight">
                  Ready to Elevate Your Digital Presence?
                </h2>
                <p className="max-w-[900px] text-[#d9d2e9]/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who have optimized their profiles
                  and advanced their careers.
                </p>
              </div>
              <div className="mt-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#8a3ffc] text-[#d9d2e9] hover:bg-white hover:text-[#8a3ffc] relative overflow-hidden group"
                >
                  <Link href="/analyze">
                    <span className="relative z-10 flex items-center">
                      Analyze Your Profile{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-[#d9d2e9]/10 py-6 bg-[#1e0a3c]">
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
