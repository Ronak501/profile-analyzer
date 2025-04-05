"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Github,
  Linkedin,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// Define types based on the API response
interface Repository {
  description: string | null;
  forks: number;
  language: string;
  name: string;
  repo_url: string;
  stars: number;
}

interface GithubAnalysis {
  bio: string;
  blog: string;
  company: null | string;
  created_at: string;
  followers: number;
  following: number;
  location: null | string;
  most_used_languages: string[];
  name: string;
  profile_url: string;
  public_repos: number;
  repositories: Repository[];
  total_contributions: number;
  updated_at: string;
}

interface LeetcodeAnalysis {
  badges: {
    data: {
      matchedUser: {
        badges: any[];
      };
    };
  };
  contest_history: {
    errors: any[];
  };
  language_stats: {
    data: {
      matchedUser: {
        languageProblemCount: {
          languageName: string;
          problemsSolved: number;
        }[];
      };
    };
  };
  profile: {
    data: {
      matchedUser: {
        profile: {
          aboutMe: string;
          countryName: string;
          ranking: number;
          realName: string;
          reputation: number;
        };
        username: string;
      };
    };
  };
  solved_stats: {
    data: {
      allQuestionsCount: {
        count: number;
        difficulty: string;
      }[];
      matchedUser: {
        submitStatsGlobal: {
          acSubmissionNum: {
            count: number;
            difficulty: string;
          }[];
        };
      };
    };
  };
  topics: {
    data: {
      matchedUser: {
        tagProblemCounts: {
          advanced: any[];
          fundamental: any[];
          intermediate: any[];
        };
      };
    };
  };
}

interface ApiResponse {
  github_analysis: GithubAnalysis;
  leetcode_analysis: LeetcodeAnalysis;
}

// Calculate language percentages from the most_used_languages array
const calculateLanguagePercentages = (
  languages: string[]
): { name: string; percentage: number }[] => {
  const counts: Record<string, number> = {};

  // Count occurrences of each language
  languages.forEach((lang) => {
    counts[lang] = (counts[lang] || 0) + 1;
  });

  // Convert to percentage
  const total = languages.length;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
};

// Generate strengths and weaknesses based on the data
const generateInsights = (data: ApiResponse) => {
  const strengths = [
    data.github_analysis.repositories.length > 10
      ? "Good variety of projects"
      : "Starting to build a project portfolio",
    data.github_analysis.most_used_languages.includes("JavaScript")
      ? "Strong JavaScript skills"
      : "Exploring different programming languages",
    data.github_analysis.most_used_languages.includes("TypeScript")
      ? "TypeScript experience shows attention to type safety"
      : "Consider exploring TypeScript for larger projects",
    data.github_analysis.repositories.some((repo) => repo.stars > 0)
      ? "Projects receiving recognition with stars"
      : "Building projects that others find valuable",
    "Active in creating personal projects",
  ];

  const weaknesses = [
    data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
      (x) => x.difficulty === "Hard"
    )?.count === 0
      ? "No hard-level coding problems solved yet"
      : "Continue challenging yourself with hard problems",
    data.github_analysis.followers < 10
      ? "Could expand GitHub network"
      : "Good GitHub following",
    data.github_analysis.total_contributions < 50
      ? "Increase contribution frequency"
      : "Consistent GitHub contributions",
    "Consider adding more detailed project documentation",
    "Explore contributing to open-source projects",
  ];

  return { strengths, weaknesses };
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<{
    strengths: string[];
    weaknesses: string[];
  }>({
    strengths: [],
    weaknesses: [],
  });
  const [languagePercentages, setLanguagePercentages] = useState<
    { name: string; percentage: number }[]
  >([]);
  const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      try {
        const github = localStorage.getItem("github");
        const leetcode = localStorage.getItem("leetcode");
        const res = await fetch(
          `http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`
        );

        console.log("Response:", res);

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await res.json();
        console.log("Result:", result);

        // Set the data from the API response
        setData(result);

        // Calculate language percentages
        if (result.github_analysis?.most_used_languages) {
          const langPercentages = calculateLanguagePercentages(
            result.github_analysis.most_used_languages
          );
          setLanguagePercentages(langPercentages);
        }

        // Generate insights
        if (result.github_analysis && result.leetcode_analysis) {
          const generatedInsights = generateInsights(result);
          setInsights(generatedInsights);
        }

        // Select featured repos
        if (result.github_analysis?.repositories) {
          const featured = result.github_analysis.repositories
            .filter(
              (repo:any) => repo.stars > 0 || repo.forks > 0 || repo.description
            )
            .sort((a:any, b:any) => b.stars + b.forks - (a.stars + a.forks))
            .slice(0, 4);
          setFeaturedRepos(featured);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Analysis refreshed successfully");
    }, 1500);
  };

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9d2e9] border-t-[#8a3ffc]"></div>
          <p className="text-lg font-medium text-[#d9d2e9]">
            Loading profile data...
          </p>
        </div>
      </div>
    );
  }

  // Calculate profile score based on various metrics
  const calculateScore = () => {
    let score = 0;

    // GitHub metrics
    score += Math.min(data.github_analysis.repositories.length, 20) * 2; // Max 40 points for repos
    score += Math.min(data.github_analysis.total_contributions, 50) * 0.4; // Max 20 points for contributions
    score +=
      Math.min(
        data.github_analysis.repositories.reduce(
          (acc, repo) => acc + repo.stars,
          0
        ),
        20
      ) * 0.5; // Max 10 points for stars

    // LeetCode metrics
    const leetcodeSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "All"
      )?.count ?? 0;
    score += Math.min(leetcodeSolved, 50) * 0.4;

    // Medium and Hard problems give bonus points
    const mediumSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Medium"
      )?.count ?? 0;
    const hardSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Hard"
      )?.count ?? 0;

    score += mediumSolved * 1; // Bonus for medium problems
    score += hardSolved * 2; // Bonus for hard problems

    return Math.min(Math.round(score), 100); // Cap at 100
  };

  const profileScore = calculateScore();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative">
      {/* Spotlight effects */}
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
                href="/dashboard"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                History
              </Link>
              <Link
                href="/settings"
                className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-[#d9d2e9] hover:bg-white/10"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh Analysis"}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm mb-2">
                  <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
                  <span>Analysis Complete</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#d9d2e9]">
                  {data.github_analysis.name}'s Profile
                </h1>
                <p className="text-[#d9d2e9]/70">
                  Last updated:{" "}
                  {new Date(data.github_analysis.updated_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#d9d2e9] hover:bg-white/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#d9d2e9] hover:bg-white/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg text-[#d9d2e9]">
                    Recruiter Readiness
                  </CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">
                    Overall profile score
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="relative h-36 w-36">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          className="stroke-[#d9d2e9]/20"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeWidth="10"
                        />
                        <circle
                          className="stroke-[#8a3ffc]"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeWidth="10"
                          strokeDasharray={`${profileScore * 2.51} 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#d9d2e9]">
                          {profileScore}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#d9d2e9]">
                        {profileScore >= 80
                          ? "Excellent"
                          : profileScore >= 60
                          ? "Good"
                          : profileScore >= 40
                          ? "Average"
                          : "Needs Improvement"}
                      </p>
                      <p className="text-xs text-[#d9d2e9]/70">
                        {profileScore >= 70
                          ? "Top 25% of developers"
                          : profileScore >= 50
                          ? "Top 50% of developers"
                          : "Building foundations"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg text-[#d9d2e9]">
                    Platform Breakdown
                  </CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">
                    Performance across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            GitHub
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">
                          {Math.min(
                            Math.round(
                              data.github_analysis.repositories.length * 3 +
                                data.github_analysis.total_contributions * 2
                            ),
                            100
                          )}
                          /100
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          Math.round(
                            data.github_analysis.repositories.length * 3 +
                              data.github_analysis.total_contributions * 2
                          ),
                          100
                        )}
                        className="h-2 bg-[#d9d2e9]/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            LinkedIn
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">
                          65/100
                        </span>
                      </div>
                      <Progress value={65} className="h-2 bg-[#d9d2e9]/10" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            LeetCode
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">
                          {Math.min(
                            Math.round(
                              (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "All"
                              )?.count ?? 0) * 5
                            ),
                            100
                          )}
                          /100
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          Math.round(
                            (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "All"
                            )?.count ?? 0) * 5
                          ),
                          100
                        )}
                        className="h-2 bg-[#d9d2e9]/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg text-[#d9d2e9]">
                    Skill Assessment
                  </CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">
                    Top skills based on your profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {data.github_analysis.most_used_languages.map(
                      (language, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
                        >
                          {language}
                        </Badge>
                      )
                    )}
                    <Badge
                      variant="secondary"
                      className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
                    >
                      Problem Solving
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
                    >
                      Git
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              defaultValue="overview"
              className="space-y-4"
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-[#d9d2e9]/10 text-[#d9d2e9]">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="github"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  GitHub
                </TabsTrigger>
                <TabsTrigger
                  value="linkedin"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="coding"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  LeetCode
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">
                        Strengths
                      </CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">
                        Areas where your profile excels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {insights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                            <span className="text-[#d9d2e9]">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">
                        Areas for Improvement
                      </CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">
                        Opportunities to enhance your profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {insights.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-[#d9d2e9]">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">
                      Peer Comparison
                    </CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      How you compare to other developers in your field
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            GitHub Activity
                          </span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            Above Average
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div className="absolute h-full w-[65%] rounded-full bg-[#8a3ffc]" />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[65%] top-0 transform -translate-x-1/2" />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            Problem Solving Skills
                          </span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            Average
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div className="absolute h-full w-[50%] rounded-full bg-[#8a3ffc]" />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[50%] top-0 transform -translate-x-1/2" />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            Professional Network
                          </span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            Needs Improvement
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div className="absolute h-full w-[30%] rounded-full bg-[#8a3ffc]" />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[30%] top-0 transform -translate-x-1/2" />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="github" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Repositories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.github_analysis.public_repos}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        +3 in the last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Stars
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.github_analysis.repositories.reduce(
                          (acc, repo) => acc + repo.stars,
                          0
                        )}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        +2 in the last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Contributions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.github_analysis.total_contributions}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        +5 in the last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Followers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.github_analysis.followers}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        Growing network
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">
                      Language Distribution
                    </CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      Languages used across your repositories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      {languagePercentages.map((language, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#d9d2e9]">
                              {language.name}
                            </span>
                            <span className="text-sm font-medium text-[#d9d2e9]">
                              {language.percentage}%
                            </span>
                          </div>
                          <Progress
                            value={language.percentage}
                            className="h-2 bg-[#d9d2e9]/10"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">
                      Featured Projects
                    </CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      Highlighted repositories from your GitHub
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid gap-4 md:grid-cols-2">
                      {featuredRepos.map((repo, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-[#d9d2e9]">
                                {repo.name}
                              </h3>
                              <p className="text-sm text-[#d9d2e9]/70 mt-1">
                                {repo.description || "No description provided"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
                            >
                              {repo.language}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-[#d9d2e9]/70">
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1 text-[#d9d2e9]/50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                              </svg>
                              <span>{repo.stars}</span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1 text-[#d9d2e9]/50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M7 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                <path d="M20.42 12.58a9 9 0 1 1 -8.42 -8.58" />
                                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                <path d="M12 7v5l3 3" />
                              </svg>
                              <span>Updated recently</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coding" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Problems Solved
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                          (x) => x.difficulty === "All"
                        )?.count || 0}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        +3 in the last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Preferred Language
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.leetcode_analysis.language_stats.data.matchedUser
                          .languageProblemCount[0]?.languageName || "N/A"}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        Used for all solutions
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Ranking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        #
                        {data.leetcode_analysis.profile.data.matchedUser.profile.ranking.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">
                        Global ranking
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">
                        Country
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {
                          data.leetcode_analysis.profile.data.matchedUser
                            .profile.countryName
                        }
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">Location</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">
                      Problem Difficulty Breakdown
                    </CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      Distribution of solved problems by difficulty
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex h-60 items-end gap-2">
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div
                          className="bg-green-500/80 rounded-t-md w-full"
                          style={{
                            height: `${
                              ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "Easy"
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                  (x) => x.difficulty === "All"
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">
                            Easy
                          </span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Easy"
                            )?.count || 0}
                          </p>
                        </div>
                      </div>
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div
                          className="bg-yellow-500/80 rounded-t-md w-full"
                          style={{
                            height: `${
                              ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "Medium"
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                  (x) => x.difficulty === "All"
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">
                            Medium
                          </span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Medium"
                            )?.count || 0}
                          </p>
                        </div>
                      </div>
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div
                          className="bg-red-500/80 rounded-t-md w-full"
                          style={{
                            height: `${
                              ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "Hard"
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                  (x) => x.difficulty === "All"
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">
                            Hard
                          </span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Hard"
                            )?.count || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
