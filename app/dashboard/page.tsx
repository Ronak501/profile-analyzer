"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Code2, Github, Linkedin, Download, Share2, RefreshCw, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { set } from "date-fns"

export default function DashboardPage() {

  const [activeTab, setActiveTab] = useState("overview")
  const [data, setData] = useState(null)
  const [linkedin, setLinkedin] = useState(null)
  const [github, setGithub] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:5000/api?github_username=Ronak501&leetcode_username=9hnDm2HoWk"
        );

        console.log("Response:", res);

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await res.json();
        setLinkedin(result.linkedin);
        setGithub(result.github);
        console.log("Result:", result);

        setData(result);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchRepos();
  }, []);

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
            <Button variant="ghost" size="sm" className="ml-auto text-[#d9d2e9] hover:bg-white/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Analysis
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
                <h1 className="text-3xl font-bold tracking-tight text-[#d9d2e9]">Profile Analysis</h1>
                <p className="text-[#d9d2e9]/70">Last updated: March 31, 2025</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[#d9d2e9] hover:bg-white/10">
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
                          strokeDasharray={`${profileData.score * 2.51} 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#d9d2e9]">{profileData.score}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#d9d2e9]">Good</p>
                      <p className="text-xs text-[#d9d2e9]/70">Top 25% of developers</p>
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
                        <span className="text-sm font-medium text-[#d9d2e9]">82/100</span>
                      </div>
                      <Progress value={82} className="h-2 bg-[#d9d2e9]/10" indicatorClassName="bg-[#8a3ffc]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">LinkedIn</span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">65/100</span>
                      </div>
                      <Progress value={65} className="h-2 bg-[#d9d2e9]/10" indicatorClassName="bg-[#8a3ffc]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">Coding Platforms</span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">88/100</span>
                      </div>
                      <Progress value={88} className="h-2 bg-[#d9d2e9]/10" indicatorClassName="bg-[#8a3ffc]" />
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
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      JavaScript
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      TypeScript
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      React
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Next.js
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Python
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Data Structures
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Algorithms
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Git
                    </Badge>
                    <Badge variant="secondary" className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20">
                      Problem Solving
                    </Badge>
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
                  value="linkedin"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="coding"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  Coding Platforms
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
                        {profileData.strengths.map((strength, index) => (
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
                        {profileData.weaknesses.map((weakness, index) => (
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
                          <span className="text-sm font-medium text-[#d9d2e9]">Above Average</span>
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
                          <span className="text-sm font-medium text-[#d9d2e9]">Problem Solving Skills</span>
                          <span className="text-sm font-medium text-[#d9d2e9]">Top 15%</span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                          <div className="absolute h-full w-[85%] rounded-full bg-[#8a3ffc]" />
                          <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                          <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[85%] top-0 transform -translate-x-1/2" />
                        </div>
                        <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                          <span>Below Average</span>
                          <span>Average</span>
                          <span>Above Average</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#d9d2e9]">Professional Network</span>
                          <span className="text-sm font-medium text-[#d9d2e9]">Average</span>
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="github" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Repositories</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">{profileData.github.repos}</div>
                      <p className="text-xs text-[#d9d2e9]/70">+3 in the last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Stars</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">{profileData.github.stars}</div>
                      <p className="text-xs text-[#d9d2e9]/70">+12 in the last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Contributions</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">{profileData.github.contributions}</div>
                      <p className="text-xs text-[#d9d2e9]/70">+86 in the last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-[#d9d2e9]">Contribution Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-2xl font-bold text-[#d9d2e9]">24 days</div>
                      <p className="text-xs text-[#d9d2e9]/70">Current streak</p>
                    </CardContent>
                  </Card>
                </div>

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
                      {profileData.github.languages.map((language, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#d9d2e9]">{language.name}</span>
                            <span className="text-sm font-medium text-[#d9d2e9]">{language.percentage}%</span>
                          </div>
                          <Progress
                            value={language.percentage}
                            className="h-2 bg-[#d9d2e9]/10"
                            indicatorClassName="bg-[#8a3ffc]"
                          />
                        </div>
                      ))}
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