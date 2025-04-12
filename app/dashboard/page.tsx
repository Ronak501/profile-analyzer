"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Github,
  Download,
  Share2,
  X,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Star,
  GitFork,
  Users,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Briefcase,
  FileCode,
} from "lucide-react"
import { toast } from "sonner"

// Define types based on the API response
interface Repository {
  description: string | null
  forks: number
  language: string
  name: string
  repo_url: string
  stars: number
}

interface GithubAnalysis {
  bio: string
  blog: string
  company: null | string
  created_at: string
  followers: number
  following: number
  location: null | string
  most_used_languages: string[]
  name: string
  profile_url: string
  public_repos: number
  repositories: Repository[]
  total_contributions: number
  updated_at: string
}

interface LeetcodeAnalysis {
  badges: {
    data: {
      matchedUser: {
        badges: Array<{
          id: string
          name: string
          displayName: string
        }>
      }
    }
  }
  contest_history: {
    data?: {
      userContestRanking: {
        attendedContestsCount: number
        rating: number
        globalRanking: number
        totalParticipants: number
        topPercentage: number
      }
    }
    errors?: any[]
  }
  language_stats: {
    data: {
      matchedUser: {
        languageProblemCount: Array<{
          languageName: string
          problemsSolved: number
        }>
      }
    }
  }
  profile: {
    data: {
      matchedUser: {
        profile: {
          aboutMe: string
          countryName: string
          ranking: number
          realName: string
          reputation: number
        }
        username: string
      }
    }
  }
  solved_stats: {
    data: {
      allQuestionsCount: Array<{
        count: number
        difficulty: string
      }>
      matchedUser: {
        submitStatsGlobal: {
          acSubmissionNum: Array<{
            count: number
            difficulty: string
          }>
        }
      }
    }
  }
  topics: {
    data: {
      matchedUser: {
        tagProblemCounts: {
          advanced: Array<{
            tagName: string
            problemsSolved: number
          }>
          fundamental: Array<{
            tagName: string
            problemsSolved: number
          }>
          intermediate: Array<{
            tagName: string
            problemsSolved: number
          }>
        }
      }
    }
  }
}

interface ApiResponse {
  github_analysis: GithubAnalysis
  leetcode_analysis: LeetcodeAnalysis
}

// Calculate language percentages from repositories
const calculateLanguageDistribution = (repositories: Repository[]): { name: string; percentage: number }[] => {
  const languageCounts: Record<string, number> = {}
  let totalRepos = 0

  repositories.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      totalRepos++
    }
  })

  return Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalRepos) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
}

// Extract skills from repositories and languages
const extractSkills = (data: ApiResponse): string[] => {
  const skills = new Set<string>()

  // Add languages as skills
  data.github_analysis.most_used_languages.forEach((lang) => {
    if (lang) skills.add(lang)
  })

  // Add LeetCode topics as skills
  const topics = data.leetcode_analysis.topics.data?.matchedUser?.tagProblemCounts
  if (topics) {
    topics.fundamental.slice(0, 3).forEach((topic) => {
      if (topic.tagName) skills.add(topic.tagName)
    })
    topics.intermediate.slice(0, 2).forEach((topic) => {
      if (topic.tagName) skills.add(topic.tagName)
    })
    topics.advanced.slice(0, 1).forEach((topic) => {
      if (topic.tagName) skills.add(topic.tagName)
    })
  }

  // Add general development skills
  skills.add("Git")

  // Add skills based on repository descriptions
  data.github_analysis.repositories.forEach((repo) => {
    if (repo.description) {
      const desc = repo.description.toLowerCase()
      if (desc.includes("api") || desc.includes("rest")) skills.add("API Development")
      if (desc.includes("web") || desc.includes("frontend") || desc.includes("front-end")) skills.add("Web Development")
      if (desc.includes("database") || desc.includes("sql")) skills.add("Databases")
      if (desc.includes("algorithm") || desc.includes("data structure")) skills.add("Algorithms")
      if (desc.includes("machine learning") || desc.includes("ml") || desc.includes("ai"))
        skills.add("Machine Learning")
      if (desc.includes("cloud") || desc.includes("aws") || desc.includes("azure")) skills.add("Cloud Computing")
    }
  })

  return Array.from(skills)
}

const generateInsights = (data: ApiResponse) => {
  const github = data.github_analysis
  const leetcode = data.leetcode_analysis

  const repoCount = github.repositories?.length || 0
  const starredRepos = github.repositories?.filter((r) => r.stars > 0).length || 0
  const forkedRepos = github.repositories?.filter((r) => r.forks > 0).length || 0

  const solvedStats = leetcode.solved_stats?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || []
  const getSolved = (difficulty: string) => solvedStats.find((x) => x.difficulty === difficulty)?.count || 0

  const strengths: string[] = []
  const weaknesses: string[] = []

  // GitHub strengths
  if (repoCount > 10) strengths.push("Wide range of GitHub projects")
  if (github.most_used_languages?.length >= 3) strengths.push("Diverse language proficiency")
  if (github.most_used_languages?.includes("JavaScript")) strengths.push("Good command over JavaScript")
  if (github.most_used_languages?.includes("Python")) strengths.push("Good command over Python")
  if (github.most_used_languages?.includes("TypeScript"))
    strengths.push("Experience with TypeScript for type-safe development")
  if (starredRepos > 5) strengths.push("Projects received stars — well-recognized by others")
  if (forkedRepos > 2) strengths.push("Projects are being reused by others — good impact")
  if (github.total_contributions >= 50) strengths.push("Consistent GitHub activity")
  if (github.blog) strengths.push("Active in knowledge sharing via blog")
  if (github.following > github.followers) strengths.push("Learning from others — good growth mindset")
  if (github.following < github.followers) strengths.push("Others are learning from you — good impact")

  // LeetCode strengths
  if (getSolved("All") > 50) strengths.push("Strong problem-solving skills demonstrated on LeetCode")
  if (getSolved("Medium") > 20) strengths.push("Comfortable with medium difficulty algorithmic challenges")
  if (getSolved("Hard") > 5) strengths.push("Capable of solving complex algorithmic problems")

  const leetcodeLanguages = leetcode.language_stats?.data?.matchedUser?.languageProblemCount || []
  if (leetcodeLanguages.length > 2) strengths.push("Solves problems in multiple programming languages")

  // GitHub weaknesses
  if (getSolved("Hard") === 0) weaknesses.push("No hard-level LeetCode problems solved yet")
  if (github.followers < 10) weaknesses.push("Low GitHub following — try sharing more")
  if (github.total_contributions < 50) weaknesses.push("Low contribution count — contribute more regularly")
  if (github.repositories?.some((repo) => !repo.description)) weaknesses.push("Some projects lack descriptions")
  if (github.repositories?.some((repo) => !repo.language))
    weaknesses.push("Some repositories missing language classification")
  if (!github.blog) weaknesses.push("No blog found — consider sharing knowledge through writing")
  if (repoCount < 5) weaknesses.push("Few GitHub projects — consider adding more")
  if (github.most_used_languages?.length < 3)
    weaknesses.push("Limited language diversity — consider exploring more languages")

  // LeetCode weaknesses
  if (getSolved("All") < 20) weaknesses.push("Very few total LeetCode problems solved")
  if (getSolved("Medium") < 10) weaknesses.push("Focus more on medium difficulty problems")
  if (getSolved("Hard") < 3) weaknesses.push("Challenge yourself with more hard problems")

  return { strengths, weaknesses }
}

// Generate project suggestions based on skills
const generateProjectSuggestions = (data: ApiResponse): string[] => {
  const suggestions: string[] = []
  const languages = data.github_analysis.most_used_languages

  if (languages.includes("JavaScript") || languages.includes("TypeScript")) {
    suggestions.push("Build a full-stack application using Next.js with server components and API routes")
    suggestions.push("Create a real-time chat application with WebSockets or Firebase")
  }

  if (languages.includes("Python")) {
    suggestions.push("Develop a REST API with FastAPI or Django REST framework")
    suggestions.push("Build a data analysis dashboard with Pandas and Plotly/Dash")
  }

  if (languages.includes("Java") || languages.includes("C#")) {
    suggestions.push("Create a microservices architecture with Spring Boot/ASP.NET Core")
    suggestions.push("Develop an enterprise-level application with proper authentication and authorization")
  }

  // Add general suggestions
  suggestions.push("Contribute to open-source projects to increase visibility and collaboration experience")
  suggestions.push("Create a personal portfolio website to showcase your projects and skills")

  return suggestions.slice(0, 3) // Return top 3 suggestions
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState<{
    strengths: string[]
    weaknesses: string[]
  }>({
    strengths: [],
    weaknesses: [],
  })
  const [languageDistribution, setLanguageDistribution] = useState<{ name: string; percentage: number }[]>([])
  const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([])

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true)
      try {
        const github = localStorage.getItem("github")
        const leetcode = localStorage.getItem("leetcode")
        console.log(`Fetching from: http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`);
        const res = await fetch(`http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`)

        if (!res.ok) {
          throw new Error("Failed to fetch")
        }

        const result = await res.json()
        console.log("Result:", result)

        // Set the data from the API response
        setData(result)

        // Calculate language distribution
        if (result.github_analysis?.repositories) {
          const langDistribution = calculateLanguageDistribution(result.github_analysis.repositories)
          setLanguageDistribution(langDistribution)
        }

        // Extract skills
        if (result.github_analysis && result.leetcode_analysis) {
          const extractedSkills = extractSkills(result)
          setSkills(extractedSkills)
        }

        // Generate insights
        if (result.github_analysis && result.leetcode_analysis) {
          const generatedInsights = generateInsights(result)
          setInsights(generatedInsights)

          // Generate project suggestions
          const suggestions = generateProjectSuggestions(result)
          setProjectSuggestions(suggestions)
        }

        // Select featured repos
        if (result.github_analysis?.repositories) {
          const featured = result.github_analysis.repositories
            .filter((repo: Repository) => 
              (repo.stars || 0) > 0 || 
              (repo.forks || 0) > 0 || 
              (repo.description || '').trim().length > 0
            )
            .sort((a: Repository, b: Repository) => 
              (b.stars || 0) + (b.forks || 0) - 
              ((a.stars || 0) + (a.forks || 0))
            )
            .slice(0, 6);
          setFeaturedRepos(featured);
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load profile data")
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Analysis refreshed successfully")
    }, 1500)
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9d2e9] border-t-[#8a3ffc]"></div>
          <p className="text-lg font-medium text-[#d9d2e9]">Loading profile data...</p>
        </div>
      </div>
    )
  }
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Profile Analysis',
          text: 'Check out this cool profile analysis!',
          url: window.location.href,
        });
      } else {
        // fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  // Calculate profile score based on various metrics - Enhanced version
  const calculateScore = () => {
    let score = 0
    let maxScore = 0

    // GitHub metrics (max 60 points)
    const repoCount = data.github_analysis.repositories.length
    const repoScore = Math.min(repoCount * 2, 20) // Max 20 points for repos
    score += repoScore
    maxScore += 20

    const contributionCount = data.github_analysis.total_contributions
    const contributionScore = Math.min(contributionCount * 0.2, 15) // Max 15 points for contributions
    score += contributionScore
    maxScore += 15

    const totalStars = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)
    const starsScore = Math.min(totalStars * 0.5, 10) // Max 10 points for stars
    score += starsScore
    maxScore += 10

    const totalForks = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)
    const forksScore = Math.min(totalForks * 0.5, 5) // Max 5 points for forks
    score += forksScore
    maxScore += 5

    const followersScore = Math.min(data.github_analysis.followers * 0.5, 5) // Max 5 points for followers
    score += followersScore
    maxScore += 5

    const languageCount = data.github_analysis.most_used_languages.length
    const languageScore = Math.min(languageCount * 1, 5) // Max 5 points for language diversity
    score += languageScore
    maxScore += 5

    // LeetCode metrics (max 40 points)
    const leetcodeSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "All",
      )?.count ?? 0
    const leetcodeSolvedScore = Math.min(leetcodeSolved * 0.2, 10) // Max 10 points for total solved
    score += leetcodeSolvedScore
    maxScore += 10

    // Medium and Hard problems give bonus points
    const mediumSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Medium",
      )?.count ?? 0
    const mediumScore = Math.min(mediumSolved * 0.5, 15) // Max 15 points for medium problems
    score += mediumScore
    maxScore += 15

    const hardSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Hard",
      )?.count ?? 0
    const hardScore = Math.min(hardSolved * 1, 15) // Max 15 points for hard problems
    score += hardScore
    maxScore += 15

    // Calculate final percentage score
    return Math.min(Math.round((score / maxScore) * 100), 100)
  }

  const profileScore = calculateScore()

  // Calculate GitHub performance score
  const calculateGitHubScore = () => {
    let score = 0
    const repoCount = data.github_analysis.repositories.length
    score += Math.min(repoCount * 3, 30)

    const contributionCount = data.github_analysis.total_contributions
    score += Math.min(contributionCount * 0.3, 30)

    const totalStars = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)
    score += Math.min(totalStars * 1, 20)

    const totalForks = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)
    score += Math.min(totalForks * 1, 10)

    const followersScore = Math.min(data.github_analysis.followers * 1, 10)
    score += followersScore

    return Math.min(score, 100)
  }

  // Calculate LeetCode performance score
  const calculateLeetCodeScore = () => {
    let score = 0

    const leetcodeSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "All",
      )?.count ?? 0
    score += Math.min(leetcodeSolved * 0.5, 40)

    const mediumSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Medium",
      )?.count ?? 0
    score += Math.min(mediumSolved * 1, 30)

    const hardSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Hard",
      )?.count ?? 0
    score += Math.min(hardSolved * 2, 30)

    return Math.min(score, 100)
  }

  const githubScore = calculateGitHubScore()
  const leetcodeScore = calculateLeetCodeScore()

  // Get top skills from LeetCode topics
  const getTopSkillsByCategory = (category: "fundamental" | "intermediate" | "advanced") => {
    const topics = data.leetcode_analysis.topics.data?.matchedUser?.tagProblemCounts
    if (!topics) return []

    return topics[category]
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 5)
      .map((topic) => ({
        name: topic.tagName,
        count: topic.problemsSolved,
      }))
  }

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
              <span className="font-bold text-xl text-[#d9d2e9] sm:inline-block">DevProfiler</span>
            </Link>
            <nav className="flex items-center space-x-6 text-base font-medium">
              <Link href="/dashboard" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
                Dashboard
              </Link>
              <Link href="/history" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
                History
              </Link>
              <Link href="/settings" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
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
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
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
                  {new Date(data.github_analysis.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
              <Button
  variant="ghost"
  size="sm"
  className="text-[#d9d2e9] hover:bg-white/10"
  onClick={handleShare}
>
  <Share2 className="mr-2 h-4 w-4" />
  Share
</Button>

                <Button variant="ghost" size="sm" className="text-[#d9d2e9] hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg text-[#d9d2e9]">Recruiter Readiness</CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">Overall profile score</CardDescription>
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
                        <span className="text-4xl font-bold text-[#d9d2e9]">{profileScore}</span>
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
                  <CardTitle className="text-lg text-[#d9d2e9]">Platform Breakdown</CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">Performance across platforms</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">GitHub</span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">{githubScore}/100</span>
                      </div>
                      <Progress value={githubScore} className="h-2 bg-[#d9d2e9]/10" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">LeetCode</span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">{leetcodeScore}/100</span>
                      </div>
                      <Progress value={leetcodeScore} className="h-2 bg-[#d9d2e9]/10" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg text-[#d9d2e9]">Skill Assessment</CardTitle>
                  <CardDescription className="text-[#d9d2e9]/70">Top skills based on your profiles</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
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
                      <CardTitle className="text-[#d9d2e9]">Strengths</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">Areas where your profile excels</CardDescription>
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
                      <CardTitle className="text-[#d9d2e9]">Areas for Improvement</CardTitle>
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
                    <CardTitle className="text-[#d9d2e9]">Peer Comparison</CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      How you compare to other developers in your field
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">GitHub Activity</span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            {githubScore >= 70 ? "Above Average" : githubScore >= 40 ? "Average" : "Below Average"}
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div
                            className="absolute h-full rounded-full bg-[#8a3ffc]"
                            style={{ width: `${githubScore}%` }}
                          />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div
                            className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
                            style={{ left: `${githubScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>
    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">Problem Solving Skills</span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            {leetcodeScore >= 70 ? "Above Average" : leetcodeScore >= 40 ? "Average" : "Below Average"}
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div
                            className="absolute h-full rounded-full bg-[#8a3ffc]"
                            style={{ width: `${leetcodeScore}%` }}
                          />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div
                            className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
                            style={{ left: `${leetcodeScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">Overall Profile Strength</span>
                          <span className="text-sm font-medium text-[#d9d2e9]">
                            {profileScore >= 70 ? "Above Average" : profileScore >= 40 ? "Average" : "Below Average"}
                          </span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div
                            className="absolute h-full rounded-full bg-[#8a3ffc]"
                            style={{ width: `${profileScore}%` }}
                          />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div
                            className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
                            style={{ left: `${profileScore}%` }}
                          />
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
                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">GitHub Profile</CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      <a
                        href={data.github_analysis.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#8a3ffc] transition-colors"
                      >
                        {data.github_analysis.profile_url.split("github.com/")[1]}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[#d9d2e9]">Bio</h3>
                        <p className="text-sm text-[#d9d2e9]/80">{data.github_analysis.bio || "No bio provided"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <Users className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.followers}</span>
                          <span className="text-xs text-[#d9d2e9]/70">Followers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <Users className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.following}</span>
                          <span className="text-xs text-[#d9d2e9]/70">Following</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <FileCode className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.public_repos}</span>
                          <span className="text-xs text-[#d9d2e9]/70">Repositories</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <Star className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">
                            {data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)}
                          </span>
                          <span className="text-xs text-[#d9d2e9]/70">Total Stars</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <GitFork className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">
                            {data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)}
                          </span>
                          <span className="text-xs text-[#d9d2e9]/70">Total Forks</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <Calendar className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">
                            {new Date(data.github_analysis.created_at).getFullYear()}
                          </span>
                          <span className="text-xs text-[#d9d2e9]/70">Joined Year</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <TrendingUp className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">
                            {data.github_analysis.total_contributions}
                          </span>
                          <span className="text-xs text-[#d9d2e9]/70">Contributions</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
                          <Code2 className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
                          <span className="text-lg font-bold text-[#d9d2e9]">
                            {data.github_analysis.most_used_languages.length}
                          </span>
                          <span className="text-xs text-[#d9d2e9]/70">Languages</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">Language Distribution</CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      Languages used across your repositories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      {languageDistribution.map((language, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#d9d2e9]">{language.name || "Unknown"}</span>
                            <span className="text-sm font-medium text-[#d9d2e9]">{language.percentage}%</span>
                          </div>
                          <Progress value={language.percentage} className="h-2 bg-[#d9d2e9]/10" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">Featured Projects</CardTitle>
                    <CardDescription className="text-[#d9d2e9]/70">
                      Highlighted repositories from your GitHub
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {featuredRepos.map((repo, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-[#d9d2e9]">{repo.name}</h3>
                              <p className="text-sm text-[#d9d2e9]/70 mt-1 line-clamp-2">
                                {repo.description || "No description provided"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
                            >
                              {repo.language || "Unknown"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-[#d9d2e9]/70">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-[#d9d2e9]/50" />
                              <span>{repo.stars}</span>
                            </div>
                            <div className="flex items-center">
                              <GitFork className="h-4 w-4 mr-1 text-[#d9d2e9]/50" />
                              <span>{repo.forks}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <a
                              href={repo.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#8a3ffc] hover:text-[#a66eff] flex items-center gap-1"
                            >
                              View Repository <ExternalLink className="h-3 w-3" />
                            </a>
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
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Problems Solved</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                          (x) => x.difficulty === "All",
                        )?.count || 0}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">Total solved problems</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Contest Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.leetcode_analysis.contest_history.data?.userContestRanking?.rating || "N/A"}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">Current rating</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Global Ranking</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        #{data.leetcode_analysis.profile.data.matchedUser.profile.ranking.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">Worldwide position</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Top Percentage</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">
                        {data.leetcode_analysis.contest_history.data?.userContestRanking?.topPercentage?.toFixed(1) ||
                          "N/A"}
                        %
                      </div>
                      <p className="text-xs text-[#d9d2e9]/70">Among all participants</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-[#d9d2e9]">Problem Difficulty Breakdown</CardTitle>
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
                                (x) => x.difficulty === "Easy",
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                  (x) => x.difficulty === "Easy",
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">Easy</span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Easy",
                            )?.count || 0}
                            <span className="text-xs text-[#d9d2e9]/70">
                              /
                              {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                (x) => x.difficulty === "Easy",
                              )?.count || 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div
                          className="bg-yellow-500/80 rounded-t-md w-full"
                          style={{
                            height: `${
                              ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "Medium",
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                  (x) => x.difficulty === "Medium",
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">Medium</span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Medium",
                            )?.count || 0}
                            <span className="text-xs text-[#d9d2e9]/70">
                              /
                              {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                (x) => x.difficulty === "Medium",
                              )?.count || 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div
                          className="bg-red-500/80 rounded-t-md w-full"
                          style={{
                            height: `${
                              ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                (x) => x.difficulty === "Hard",
                              )?.count || 0) /
                                (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                  (x) => x.difficulty === "Hard",
                                )?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
                          <span className="text-xs font-medium text-[#d9d2e9]">Hard</span>
                          <p className="text-sm font-bold text-[#d9d2e9]">
                            {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                              (x) => x.difficulty === "Hard",
                            )?.count || 0}
                            <span className="text-xs text-[#d9d2e9]/70">
                              /
                              {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
                                (x) => x.difficulty === "Hard",
                              )?.count || 0}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">Programming Languages</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">Languages used to solve problems</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-4">
                        {data.leetcode_analysis.language_stats.data.matchedUser.languageProblemCount
                          .slice(0, 5)
                          .map((lang, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#d9d2e9]">{lang.languageName}</span>
                                <span className="text-sm font-medium text-[#d9d2e9]">
                                  {lang.problemsSolved} problems
                                </span>
                              </div>
                              <Progress
                                value={
                                  (lang.problemsSolved /
                                    (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                                      (x) => x.difficulty === "All",
                                    )?.count || 1)) *
                                  100
                                }
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
                      <CardTitle className="text-[#d9d2e9]">Badges Earned</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">Achievements on LeetCode</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      {data.leetcode_analysis.badges.data?.matchedUser?.badges?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {data.leetcode_analysis.badges.data.matchedUser.badges.map((badge, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 rounded-lg border border-[#d9d2e9]/10 bg-white/5"
                            >
                              <Award className="h-5 w-5 text-[#8a3ffc]" />
                              <div>
                                <p className="text-sm font-medium text-[#d9d2e9]">{badge.displayName}</p>
                                <p className="text-xs text-[#d9d2e9]/70">{badge.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                          <Award className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                          <p className="text-sm text-[#d9d2e9]/70">No badges earned yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">Fundamental Skills</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">Basic programming concepts</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {getTopSkillsByCategory("fundamental").map((skill, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
                            <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
                              {skill.count}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">Intermediate Skills</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">Advanced programming concepts</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {getTopSkillsByCategory("intermediate").map((skill, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
                            <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
                              {skill.count}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[#d9d2e9]">Advanced Skills</CardTitle>
                      <CardDescription className="text-[#d9d2e9]/70">
                        Complex algorithms and data structures
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {getTopSkillsByCategory("advanced").map((skill, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
                            <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
                              {skill.count}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[#8a3ffc]" />
                        <CardTitle className="text-[#d9d2e9]">Project Suggestions</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">Based on your current skillset</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        {projectSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                            <span className="text-[#d9d2e9]">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-[#d9d2e9]">Skill Gaps</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">Areas to focus on for improvement</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        {insights.weaknesses.slice(0, 4).map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-[#d9d2e9]">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#8a3ffc]" />
                        <CardTitle className="text-[#d9d2e9]">Documentation & Presentation</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">
                        Improve how you showcase your work
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        {data.github_analysis.repositories.some((repo) => !repo.description) && (
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                            <span className="text-[#d9d2e9]">
                              Add descriptions to all your repositories to make them more discoverable
                            </span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Create comprehensive README files with setup instructions and screenshots
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Pin your best repositories to your GitHub profile to highlight your best work
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Create a personal portfolio website to showcase your projects in a more visual way
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#8a3ffc]" />
                        <CardTitle className="text-[#d9d2e9]">Community & Collaboration</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">
                        Enhance your network and collaborative skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Contribute to open-source projects to build your network and gain experience
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Participate in LeetCode contests to improve your problem-solving skills
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Share your knowledge through blog posts or technical articles
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Join developer communities and forums to connect with other professionals
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-[#d9d2e9]">Code Quality Tips</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">Improve your coding practices</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-[#d9d2e9]">
                            Use consistent coding styles and follow language-specific conventions
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-[#d9d2e9]">
                            Write semantic commit messages (e.g., "feat: add login form")
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-[#d9d2e9]">Implement unit tests to ensure code reliability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-[#d9d2e9]">
                            Use linters and code formatters to maintain code quality
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#8a3ffc]" />
                        <CardTitle className="text-[#d9d2e9]">Growth Opportunities</CardTitle>
                      </div>
                      <CardDescription className="text-[#d9d2e9]/70">Next steps for career advancement</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Explore{" "}
                            {data.github_analysis.most_used_languages.length < 3
                              ? "more programming languages"
                              : "advanced concepts in your preferred languages"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">
                            Build projects that demonstrate full-stack capabilities
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">Learn about cloud services and deployment strategies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                          <span className="text-[#d9d2e9]">Practice system design and architecture principles</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-[#d9d2e9]/10 py-6 bg-[#1e0a3c] relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#d9d2e9]/50 md:text-left">© 2025 DevProfiler. All rights reserved.</p>
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
  )
}