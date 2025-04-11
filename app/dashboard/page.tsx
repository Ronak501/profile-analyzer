// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import {
//   Code2,
//   Github,
//   Linkedin,
//   Download,
//   Share2,
//   RefreshCw,
//   Sparkles,
// } from "lucide-react";
// import { toast } from "sonner";

// // Define types based on the API response
// interface Repository {
//   description: string | null;
//   forks: number;
//   language: string;
//   name: string;
//   repo_url: string;
//   stars: number;
// }

// interface GithubAnalysis {
//   bio: string;
//   blog: string;
//   company: null | string;
//   created_at: string;
//   followers: number;
//   following: number;
//   location: null | string;
//   most_used_languages: string[];
//   name: string;
//   profile_url: string;
//   public_repos: number;
//   repositories: Repository[];
//   total_contributions: number;
//   updated_at: string;
// }

// interface LeetcodeAnalysis {
//   badges: {
//     data: {
//       matchedUser: {
//         badges: any[];
//       };
//     };
//   };
//   contest_history: {
//     errors: any[];
//   };
//   language_stats: {
//     data: {
//       matchedUser: {
//         languageProblemCount: {
//           languageName: string;
//           problemsSolved: number;
//         }[];
//       };
//     };
//   };
//   profile: {
//     data: {
//       matchedUser: {
//         profile: {
//           aboutMe: string;
//           countryName: string;
//           ranking: number;
//           realName: string;
//           reputation: number;
//         };
//         username: string;
//       };
//     };
//   };
//   solved_stats: {
//     data: {
//       allQuestionsCount: {
//         count: number;
//         difficulty: string;
//       }[];
//       matchedUser: {
//         submitStatsGlobal: {
//           acSubmissionNum: {
//             count: number;
//             difficulty: string;
//           }[];
//         };
//       };
//     };
//   };
//   topics: {
//     data: {
//       matchedUser: {
//         tagProblemCounts: {
//           advanced: any[];
//           fundamental: any[];
//           intermediate: any[];
//         };
//       };
//     };
//   };
// }

// interface ApiResponse {
//   github_analysis: GithubAnalysis;
//   leetcode_analysis: LeetcodeAnalysis;
// }

// // Calculate language percentages from the most_used_languages array
// const calculateLanguagePercentages = (
//   languages: string[]
// ): { name: string; percentage: number }[] => {
//   const counts: Record<string, number> = {};

//   // Count occurrences of each language
//   languages.forEach((lang) => {
//     counts[lang] = (counts[lang] || 0) + 1;
//   });

//   // Convert to percentage
//   const total = languages.length;
//   return Object.entries(counts)
//     .map(([name, count]) => ({
//       name,
//       percentage: Math.round((count / total) * 100),
//     }))
//     .sort((a, b) => b.percentage - a.percentage);
// };

// const generateInsights = (data: ApiResponse) => {
//   const github = data.github_analysis;
//   const leetcode = data.leetcode_analysis;

//   const repoCount = github.repositories?.length || 0;
//   const starredRepos = github.repositories?.filter(r => r.stars > 0).length || 0;
//   const forkedRepos = github.repositories?.filter(r => r.forks > 0).length || 0;

//   const solvedStats = leetcode.solved_stats?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
//   const getSolved = (difficulty: string) =>
//     solvedStats.find((x) => x.difficulty === difficulty)?.count || 0;

//   const strengths: string[] = [];

//   if (repoCount > 10) strengths.push("Wide range of GitHub projects");
//   if (github.most_used_languages?.includes("JavaScript")) strengths.push("Good command over JavaScript");
//   if (github.most_used_languages?.includes("python")) strengths.push("Good command over python");
//   if (github.most_used_languages?.includes("TypeScript")) strengths.push("Experience with TypeScript for type-safe development");
//   if (starredRepos > 5) strengths.push("Projects received stars — well-recognized by others");
//   if (forkedRepos > 2) strengths.push("Projects are being reused by others — good impact");
//   if (github.total_contributions >= 50) strengths.push("Consistent GitHub activity");
//   if (github.blog) strengths.push("Active in knowledge sharing via blog");
//   if (github.following > github.followers) strengths.push("Learning from others — good growth mindset");
//   if (github.following < github.followers) strengths.push("others are learning from you — good impact");


//   const weaknesses: string[] = [];

//   if (getSolved("Hard") === 0) weaknesses.push("No hard-level LeetCode problems solved yet");
//   if (github.followers < 10) weaknesses.push("Low GitHub following — try sharing more");
//   if (github.total_contributions < 50) weaknesses.push("Low contribution count — contribute more regularly");
//   if (github.repositories?.some(repo => !repo.description)) weaknesses.push("Some projects lack descriptions");
//   if (github.repositories?.some(repo => !repo.language)) weaknesses.push("Some repositories missing language classification");
//   if (!github.blog) weaknesses.push("No blog found — consider sharing knowledge through writing");
//   if (github.followers > github.following) weaknesses.push("Consider following others to learn more");
//   if (repoCount < 5) weaknesses.push("Few GitHub projects — consider adding more");
//   if (github.most_used_languages?.length < 3) weaknesses.push("Limited language diversity — consider exploring more languages");
//   if (getSolved("All") < 20) weaknesses.push("Very few total LeetCode problems solved");

//   return { strengths, weaknesses };
// };

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [data, setData] = useState<ApiResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [insights, setInsights] = useState<{
//     strengths: string[];
//     weaknesses: string[];
//   }>({
//     strengths: [],
//     weaknesses: [],
//   });
//   const [languagePercentages, setLanguagePercentages] = useState<
//     { name: string; percentage: number }[]
//   >([]);
//   const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([]);

//   useEffect(() => {
//     const fetchRepos = async () => {
//       setIsLoading(true);
//       try {
//         const github = localStorage.getItem("github");
//         const leetcode = localStorage.getItem("leetcode");
//         const res = await fetch(
//           `http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`
//         );

//         console.log("Response:", res);

//         if (!res.ok) {
//           throw new Error("Failed to fetch");
//         }

//         const result = await res.json();
//         console.log("Result:", result);

//         // Set the data from the API response
//         setData(result);

//         // Calculate language percentages
//         if (result.github_analysis?.most_used_languages) {
//           const langPercentages = calculateLanguagePercentages(
//             result.github_analysis.most_used_languages
//           );
//           setLanguagePercentages(langPercentages);
//         }

//         // Generate insights
//         if (result.github_analysis && result.leetcode_analysis) {
//           const generatedInsights = generateInsights(result);
//           setInsights(generatedInsights);
//         }

//         // Select featured repos
//         if (result.github_analysis?.repositories) {
//           const featured = result.github_analysis.repositories
//             .filter(
//               (repo:any) => repo.stars > 0 || repo.forks > 0 || repo.description
//             )
//             .sort((a:any, b:any) => b.stars + b.forks - (a.stars + a.forks))
//             .slice(0, 4);
//           setFeaturedRepos(featured);
//         }

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load profile data");
//         setIsLoading(false);
//       }
//     };

//     fetchRepos();
//   }, []);

//   const handleRefresh = () => {
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       toast.success("Analysis refreshed successfully");
//     }, 1500);
//   };

//   if (isLoading || !data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9d2e9] border-t-[#8a3ffc]"></div>
//           <p className="text-lg font-medium text-[#d9d2e9]">
//             Loading profile data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Calculate profile score based on various metrics
//   const calculateScore = () => {
//     let score = 0;

//     // GitHub metrics
//     score += Math.min(data.github_analysis.repositories.length, 20) * 2; // Max 40 points for repos
//     score += Math.min(data.github_analysis.total_contributions, 50) * 0.4; // Max 20 points for contributions
//     score +=
//       Math.min(
//         data.github_analysis.repositories.reduce(
//           (acc, repo) => acc + repo.stars,
//           0
//         ),
//         20
//       ) * 0.5; // Max 10 points for stars

//     // LeetCode metrics
//     const leetcodeSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "All"
//       )?.count ?? 0;
//     score += Math.min(leetcodeSolved, 50) * 0.4;

//     // Medium and Hard problems give bonus points
//     const mediumSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Medium"
//       )?.count ?? 0;
//     const hardSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Hard"
//       )?.count ?? 0;

//     score += mediumSolved * 1; // Bonus for medium problems
//     score += hardSolved * 2; // Bonus for hard problems

//     return Math.min(Math.round(score), 100); // Cap at 100
//   };

//   const profileScore = calculateScore();

//   return (
//     <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative">
//       {/* Spotlight effects */}
//       <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
//       <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
//       <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>

//       <header className="sticky top-0 z-50 w-full border-b border-[#d9d2e9]/10 bg-[#1e0a3c]/80 backdrop-blur-sm">
//         <div className="container flex h-20 items-center">
//           <div className="mr-4 flex">
//             <Link href="/" className="mr-6 flex items-center space-x-2">
//               <Code2 className="h-8 w-8 text-[#d9d2e9]" />
//               <span className="font-bold text-xl text-[#d9d2e9] sm:inline-block">
//                 DevProfiler
//               </span>
//             </Link>
//             <nav className="flex items-center space-x-6 text-base font-medium">
//               <Link
//                 href="/dashboard"
//                 className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 href="/history"
//                 className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
//               >
//                 History
//               </Link>
//               <Link
//                 href="/settings"
//                 className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg"
//               >
//                 Settings
//               </Link>
//             </nav>
//           </div>
//           <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-auto text-[#d9d2e9] hover:bg-white/10"
//               onClick={handleRefresh}
//               disabled={isLoading}
//             >
//               <RefreshCw
//                 className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
//               />
//               {isLoading ? "Refreshing..." : "Refresh Analysis"}
//             </Button>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1 py-8 relative z-10">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-8">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm mb-2">
//                   <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
//                   <span>Analysis Complete</span>
//                 </div>
//                 <h1 className="text-3xl font-bold tracking-tight text-[#d9d2e9]">
//                   {data.github_analysis.name}'s Profile
//                 </h1>
//                 <p className="text-[#d9d2e9]/70">
//                   Last updated:{" "}
//                   {new Date(data.github_analysis.updated_at).toLocaleDateString(
//                     "en-US",
//                     {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     }
//                   )}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-[#d9d2e9] hover:bg-white/10"
//                 >
//                   <Share2 className="mr-2 h-4 w-4" />
//                   Share
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-[#d9d2e9] hover:bg-white/10"
//                 >
//                   <Download className="mr-2 h-4 w-4" />
//                   Export PDF
//                 </Button>
//               </div>
//             </div>

//             <div className="grid gap-6 md:grid-cols-3">
//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">
//                     Recruiter Readiness
//                   </CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">
//                     Overall profile score
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <div className="relative h-36 w-36">
//                       <svg className="h-full w-full" viewBox="0 0 100 100">
//                         <circle
//                           className="stroke-[#d9d2e9]/20"
//                           cx="50"
//                           cy="50"
//                           r="40"
//                           fill="transparent"
//                           strokeWidth="10"
//                         />
//                         <circle
//                           className="stroke-[#8a3ffc]"
//                           cx="50"
//                           cy="50"
//                           r="40"
//                           fill="transparent"
//                           strokeWidth="10"
//                           strokeDasharray={`${profileScore * 2.51} 251`}
//                           strokeDashoffset="0"
//                           transform="rotate(-90 50 50)"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-4xl font-bold text-[#d9d2e9]">
//                           {profileScore}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm font-medium text-[#d9d2e9]">
//                         {profileScore >= 80
//                           ? "Excellent"
//                           : profileScore >= 60
//                           ? "Good"
//                           : profileScore >= 40
//                           ? "Average"
//                           : "Needs Improvement"}
//                       </p>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         {profileScore >= 70
//                           ? "Top 25% of developers"
//                           : profileScore >= 50
//                           ? "Top 50% of developers"
//                           : "Building foundations"}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">
//                     Platform Breakdown
//                   </CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">
//                     Performance across platforms
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Github className="h-4 w-4 text-[#d9d2e9]" />
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             GitHub
//                           </span>
//                         </div>
//                         <span className="text-sm font-medium text-[#d9d2e9]">
//                           {Math.min(
//                             Math.round(
//                               data.github_analysis.repositories.length * 3 +
//                                 data.github_analysis.total_contributions * 2
//                             ),
//                             100
//                           )}
//                           /100
//                         </span>
//                       </div>
//                       <Progress
//                         value={Math.min(
//                           Math.round(
//                             data.github_analysis.repositories.length * 3 +
//                               data.github_analysis.total_contributions * 2
//                           ),
//                           100
//                         )}
//                         className="h-2 bg-[#d9d2e9]/10"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Linkedin className="h-4 w-4 text-[#d9d2e9]" />
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             LinkedIn
//                           </span>
//                         </div>
//                         <span className="text-sm font-medium text-[#d9d2e9]">
//                           68/100
//                         </span>
//                       </div>
//                       <Progress value={65} className="h-2 bg-[#d9d2e9]/10" />
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Code2 className="h-4 w-4 text-[#d9d2e9]" />
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             LeetCode
//                           </span>
//                         </div>
//                         <span className="text-sm font-medium text-[#d9d2e9]">
//                           {Math.min(
//                             Math.round(
//                               (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "All"
//                               )?.count ?? 0) * 5
//                             ),
//                             100
//                           )}
//                           /100
//                         </span>
//                       </div>
//                       <Progress
//                         value={Math.min(
//                           Math.round(
//                             (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "All"
//                             )?.count ?? 0) * 5
//                           ),
//                           100
//                         )}
//                         className="h-2 bg-[#d9d2e9]/10"
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">
//                     Skill Assessment
//                   </CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">
//                     Top skills based on your profiles
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="flex flex-wrap gap-2">
//                     {data.github_analysis.most_used_languages.map(
//                       (language, index) => (
//                         <Badge
//                           key={index}
//                           variant="secondary"
//                           className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
//                         >
//                           {language}
//                         </Badge>
//                       )
//                     )}
//                     <Badge
//                       variant="secondary"
//                       className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
//                     >
//                       Problem Solving
//                     </Badge>
//                     <Badge
//                       variant="secondary"
//                       className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
//                     >
//                       Git
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Tabs
//               defaultValue="overview"
//               className="space-y-4"
//               onValueChange={setActiveTab}
//             >
//               <TabsList className="bg-[#d9d2e9]/10 text-[#d9d2e9]">
//                 <TabsTrigger
//                   value="overview"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   Overview
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="github"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   GitHub
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="linkedin"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   LinkedIn
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="coding"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   LeetCode
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="recommendations"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   Recommendations
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">
//                         Strengths
//                       </CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Areas where your profile excels
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {insights.strengths.map((strength, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                             <span className="text-[#d9d2e9]">{strength}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">
//                         Areas for Improvement
//                       </CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Opportunities to enhance your profile
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {insights.weaknesses.map((weakness, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
//                             <span className="text-[#d9d2e9]">{weakness}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">
//                       Peer Comparison
//                     </CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       How you compare to other developers in your field
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             GitHub Activity
//                           </span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             Above Average
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div className="absolute h-full w-[65%] rounded-full bg-[#8a3ffc]" />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[65%] top-0 transform -translate-x-1/2" />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             Problem Solving Skills
//                           </span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             Average
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div className="absolute h-full w-[50%] rounded-full bg-[#8a3ffc]" />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[50%] top-0 transform -translate-x-1/2" />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             Professional Network
//                           </span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             Needs Improvement
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div className="absolute h-full w-[30%] rounded-full bg-[#8a3ffc]" />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] left-[30%] top-0 transform -translate-x-1/2" />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="github" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Repositories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.github_analysis.public_repos}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         +3 in the last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Stars
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.github_analysis.repositories.reduce(
//                           (acc, repo) => acc + repo.stars,
//                           0
//                         )}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         +2 in the last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Contributions
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.github_analysis.total_contributions}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         +5 in the last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Followers
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.github_analysis.followers}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         Growing network
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">
//                       Language Distribution
//                     </CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Languages used across your repositories
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="space-y-4">
//                       {languagePercentages.map((language, index) => (
//                         <div key={index} className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-[#d9d2e9]">
//                               {language.name}
//                             </span>
//                             <span className="text-sm font-medium text-[#d9d2e9]">
//                               {language.percentage}%
//                             </span>
//                           </div>
//                           <Progress
//                             value={language.percentage}
//                             className="h-2 bg-[#d9d2e9]/10"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">
//                       Featured Projects
//                     </CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Highlighted repositories from your GitHub
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="grid gap-4 md:grid-cols-2">
//                       {featuredRepos.map((repo, index) => (
//                         <div
//                           key={index}
//                           className="rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <h3 className="font-medium text-[#d9d2e9]">
//                                 {repo.name}
//                               </h3>
//                               <p className="text-sm text-[#d9d2e9]/70 mt-1">
//                                 {repo.description || "No description provided"}
//                               </p>
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className="text-xs bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
//                             >
//                               {repo.language}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-4 mt-3 text-xs text-[#d9d2e9]/70">
//                             <div className="flex items-center">
//                               <svg
//                                 className="h-4 w-4 mr-1 text-[#d9d2e9]/50"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
//                               </svg>
//                               <span>{repo.stars}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <svg
//                                 className="h-4 w-4 mr-1 text-[#d9d2e9]/50"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M7 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
//                                 <path d="M20.42 12.58a9 9 0 1 1 -8.42 -8.58" />
//                                 <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
//                                 <path d="M12 7v5l3 3" />
//                               </svg>
//                               <span>Updated recently</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="coding" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Problems Solved
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                           (x) => x.difficulty === "All"
//                         )?.count || 0}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         +3 in the last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Preferred Language
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.leetcode_analysis.language_stats.data.matchedUser
//                           .languageProblemCount[100]?.languageName || "N/A"}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         Used for all solutions
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Ranking
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         #
//                         {data.leetcode_analysis.profile.data.matchedUser.profile.ranking.toLocaleString()}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         Global ranking
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">
//                         Country
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {
//                           data.leetcode_analysis.profile.data.matchedUser
//                             .profile.countryName
//                         }
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">Location</p>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">
//                       Problem Difficulty Breakdown
//                     </CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Distribution of solved problems by difficulty
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="flex h-60 items-end gap-2">
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-green-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Easy"
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                   (x) => x.difficulty === "All"
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">
//                             Easy
//                           </span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Easy"
//                             )?.count || 0}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-yellow-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Medium"
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                   (x) => x.difficulty === "All"
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">
//                             Medium
//                           </span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Medium"
//                             )?.count || 0}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-red-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Hard"
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                   (x) => x.difficulty === "All"
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">
//                             Hard
//                           </span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Hard"
//                             )?.count || 0}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </main>
//       <footer className="w-full border-t border-[#d9d2e9]/10 py-6 bg-[#1e0a3c] relative z-10">
//         <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
//           <p className="text-center text-sm text-[#d9d2e9]/50 md:text-left">
//             © 2025 DevProfiler. All rights reserved.
//           </p>
//           <div className="flex gap-4">
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Terms
//             </Link>
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Privacy
//             </Link>
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Contact
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


















// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { QRCodeCanvas } from "qrcode.react";

// import {
//   Code2,
//   Github,
//   Download,
//   Share2,
//   X,
//   RefreshCw,
//   Sparkles,
//   ExternalLink,
//   Star,
//   GitFork,
//   Users,
//   Calendar,
//   Award,
//   TrendingUp,
//   AlertTriangle,
//   CheckCircle,
//   BookOpen,
//   Briefcase,
//   FileCode,
// } from "lucide-react"
// import { toast } from "sonner"

// // Define types based on the API response
// interface Repository {
//   description: string | null
//   forks: number
//   language: string
//   name: string
//   repo_url: string
//   stars: number
// }

// interface GithubAnalysis {
//   bio: string
//   blog: string
//   company: null | string
//   created_at: string
//   followers: number
//   following: number
//   location: null | string
//   most_used_languages: string[]
//   name: string
//   profile_url: string
//   public_repos: number
//   repositories: Repository[]
//   total_contributions: number
//   updated_at: string
// }

// interface LeetcodeAnalysis {
//   badges: {
//     data: {
//       matchedUser: {
//         badges: Array<{
//           id: string
//           name: string
//           displayName: string
//         }>
//       }
//     }
//   }
//   contest_history: {
//     data?: {
//       userContestRanking: {
//         attendedContestsCount: number
//         rating: number
//         globalRanking: number
//         totalParticipants: number
//         topPercentage: number
//       }
//     }
//     errors?: any[]
//   }
//   language_stats: {
//     data: {
//       matchedUser: {
//         languageProblemCount: Array<{
//           languageName: string
//           problemsSolved: number
//         }>
//       }
//     }
//   }
//   profile: {
//     data: {
//       matchedUser: {
//         profile: {
//           aboutMe: string
//           countryName: string
//           ranking: number
//           realName: string
//           reputation: number
//         }
//         username: string
//       }
//     }
//   }
//   solved_stats: {
//     data: {
//       allQuestionsCount: Array<{
//         count: number
//         difficulty: string
//       }>
//       matchedUser: {
//         submitStatsGlobal: {
//           acSubmissionNum: Array<{
//             count: number
//             difficulty: string
//           }>
//         }
//       }
//     }
//   }
//   topics: {
//     data: {
//       matchedUser: {
//         tagProblemCounts: {
//           advanced: Array<{
//             tagName: string
//             problemsSolved: number
//           }>
//           fundamental: Array<{
//             tagName: string
//             problemsSolved: number
//           }>
//           intermediate: Array<{
//             tagName: string
//             problemsSolved: number
//           }>
//         }
//       }
//     }
//   }
// }

// interface ApiResponse {
//   github_analysis: GithubAnalysis
//   leetcode_analysis: LeetcodeAnalysis
// }

// // Calculate language percentages from repositories
// const calculateLanguageDistribution = (repositories: Repository[]): { name: string; percentage: number }[] => {
//   const languageCounts: Record<string, number> = {}
//   let totalRepos = 0

//   repositories.forEach((repo) => {
//     if (repo.language) {
//       languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
//       totalRepos++
//     }
//   })

//   return Object.entries(languageCounts)
//     .map(([name, count]) => ({
//       name,
//       percentage: Math.round((count / totalRepos) * 100),
//     }))
//     .sort((a, b) => b.percentage - a.percentage)
// }

// // Extract skills from repositories and languages
// const extractSkills = (data: ApiResponse): string[] => {
//   const skills = new Set<string>()

//   // Add languages as skills
//   data.github_analysis.most_used_languages.forEach((lang) => {
//     if (lang) skills.add(lang)
//   })

//   // Add LeetCode topics as skills
//   const topics = data.leetcode_analysis.topics.data?.matchedUser?.tagProblemCounts
//   if (topics) {
//     topics.fundamental.slice(0, 3).forEach((topic) => {
//       if (topic.tagName) skills.add(topic.tagName)
//     })
//     topics.intermediate.slice(0, 2).forEach((topic) => {
//       if (topic.tagName) skills.add(topic.tagName)
//     })
//     topics.advanced.slice(0, 1).forEach((topic) => {
//       if (topic.tagName) skills.add(topic.tagName)
//     })
//   }

//   // Add general development skills
//   skills.add("Git")

//   // Add skills based on repository descriptions
//   data.github_analysis.repositories.forEach((repo) => {
//     if (repo.description) {
//       const desc = repo.description.toLowerCase()
//       if (desc.includes("api") || desc.includes("rest")) skills.add("API Development")
//       if (desc.includes("web") || desc.includes("frontend") || desc.includes("front-end")) skills.add("Web Development")
//       if (desc.includes("database") || desc.includes("sql")) skills.add("Databases")
//       if (desc.includes("algorithm") || desc.includes("data structure")) skills.add("Algorithms")
//       if (desc.includes("machine learning") || desc.includes("ml") || desc.includes("ai"))
//         skills.add("Machine Learning")
//       if (desc.includes("cloud") || desc.includes("aws") || desc.includes("azure")) skills.add("Cloud Computing")
//     }
//   })

//   return Array.from(skills)
// }

// const generateInsights = (data: ApiResponse) => {
//   const github = data.github_analysis
//   const leetcode = data.leetcode_analysis

//   const repoCount = github.repositories?.length || 0
//   const starredRepos = github.repositories?.filter((r) => r.stars > 0).length || 0
//   const forkedRepos = github.repositories?.filter((r) => r.forks > 0).length || 0

//   const solvedStats = leetcode.solved_stats?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || []
//   const getSolved = (difficulty: string) => solvedStats.find((x) => x.difficulty === difficulty)?.count || 0

//   const strengths: string[] = []
//   const weaknesses: string[] = []

//   // GitHub strengths
//   if (repoCount > 10) strengths.push("Wide range of GitHub projects")
//   if (github.most_used_languages?.length >= 3) strengths.push("Diverse language proficiency")
//   if (github.most_used_languages?.includes("JavaScript")) strengths.push("Good command over JavaScript")
//   if (github.most_used_languages?.includes("Python")) strengths.push("Good command over Python")
//   if (github.most_used_languages?.includes("TypeScript"))
//     strengths.push("Experience with TypeScript for type-safe development")
//   if (starredRepos > 5) strengths.push("Projects received stars — well-recognized by others")
//   if (forkedRepos > 2) strengths.push("Projects are being reused by others — good impact")
//   if (github.total_contributions >= 50) strengths.push("Consistent GitHub activity")
//   if (github.blog) strengths.push("Active in knowledge sharing via blog")
//   if (github.following > github.followers) strengths.push("Learning from others — good growth mindset")
//   if (github.following < github.followers) strengths.push("Others are learning from you — good impact")

//   // LeetCode strengths
//   if (getSolved("All") > 50) strengths.push("Strong problem-solving skills demonstrated on LeetCode")
//   if (getSolved("Medium") > 20) strengths.push("Comfortable with medium difficulty algorithmic challenges")
//   if (getSolved("Hard") > 5) strengths.push("Capable of solving complex algorithmic problems")

//   const leetcodeLanguages = leetcode.language_stats?.data?.matchedUser?.languageProblemCount || []
//   if (leetcodeLanguages.length > 2) strengths.push("Solves problems in multiple programming languages")

//   // GitHub weaknesses
//   if (getSolved("Hard") === 0) weaknesses.push("No hard-level LeetCode problems solved yet")
//   if (github.followers < 10) weaknesses.push("Low GitHub following — try sharing more")
//   if (github.total_contributions < 50) weaknesses.push("Low contribution count — contribute more regularly")
//   if (github.repositories?.some((repo) => !repo.description)) weaknesses.push("Some projects lack descriptions")
//   if (github.repositories?.some((repo) => !repo.language))
//     weaknesses.push("Some repositories missing language classification")
//   if (!github.blog) weaknesses.push("No blog found — consider sharing knowledge through writing")
//   if (repoCount < 5) weaknesses.push("Few GitHub projects — consider adding more")
//   if (github.most_used_languages?.length < 3)
//     weaknesses.push("Limited language diversity — consider exploring more languages")

//   // LeetCode weaknesses
//   if (getSolved("All") < 20) weaknesses.push("Very few total LeetCode problems solved")
//   if (getSolved("Medium") < 10) weaknesses.push("Focus more on medium difficulty problems")
//   if (getSolved("Hard") < 3) weaknesses.push("Challenge yourself with more hard problems")

//   return { strengths, weaknesses }
// }

// // Generate project suggestions based on skills
// const generateProjectSuggestions = (data: ApiResponse): string[] => {
//   const suggestions: string[] = []
//   const languages = data.github_analysis.most_used_languages

//   if (languages.includes("JavaScript") || languages.includes("TypeScript")) {
//     suggestions.push("Build a full-stack application using Next.js with server components and API routes")
//     suggestions.push("Create a real-time chat application with WebSockets or Firebase")
//   }

//   if (languages.includes("Python")) {
//     suggestions.push("Develop a REST API with FastAPI or Django REST framework")
//     suggestions.push("Build a data analysis dashboard with Pandas and Plotly/Dash")
//   }

//   if (languages.includes("Java") || languages.includes("C#")) {
//     suggestions.push("Create a microservices architecture with Spring Boot/ASP.NET Core")
//     suggestions.push("Develop an enterprise-level application with proper authentication and authorization")
//   }

//   // Add general suggestions
//   suggestions.push("Contribute to open-source projects to increase visibility and collaboration experience")
//   suggestions.push("Create a personal portfolio website to showcase your projects and skills")

//   return suggestions.slice(0, 3) // Return top 3 suggestions
// }

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [data, setData] = useState<ApiResponse | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [insights, setInsights] = useState<{
//     strengths: string[]
//     weaknesses: string[]
//   }>({
//     strengths: [],
//     weaknesses: [],
//   })
//   const [languageDistribution, setLanguageDistribution] = useState<{ name: string; percentage: number }[]>([])
//   const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([])
//   const [skills, setSkills] = useState<string[]>([])
//   const [projectSuggestions, setProjectSuggestions] = useState<string[]>([])

//   useEffect(() => {
//     const fetchRepos = async () => {
//       setIsLoading(true)
//       try {
//         const github = localStorage.getItem("github")
//         const leetcode = localStorage.getItem("leetcode")
//         console.log(`Fetching from: http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`);
//         const res = await fetch(`http://127.0.0.1:5000/api?github_username=${github}&leetcode_username=${leetcode}`)

//         if (!res.ok) {
//           throw new Error("Failed to fetch")
//         }

//         const result = await res.json()
//         console.log("Result:", result)

//         // Set the data from the API response
//         setData(result)

//         // Calculate language distribution
//         if (result.github_analysis?.repositories) {
//           const langDistribution = calculateLanguageDistribution(result.github_analysis.repositories)
//           setLanguageDistribution(langDistribution)
//         }

//         // Extract skills
//         if (result.github_analysis && result.leetcode_analysis) {
//           const extractedSkills = extractSkills(result)
//           setSkills(extractedSkills)
//         }

//         // Generate insights
//         if (result.github_analysis && result.leetcode_analysis) {
//           const generatedInsights = generateInsights(result)
//           setInsights(generatedInsights)

//           // Generate project suggestions
//           const suggestions = generateProjectSuggestions(result)
//           setProjectSuggestions(suggestions)
//         }

//         // Select featured repos
//         if (result.github_analysis?.repositories) {
//           const featured = result.github_analysis.repositories
//             .filter((repo: Repository) => 
//               (repo.stars || 0) > 0 || 
//               (repo.forks || 0) > 0 || 
//               (repo.description || '').trim().length > 0
//             )
//             .sort((a: Repository, b: Repository) => 
//               (b.stars || 0) + (b.forks || 0) - 
//               ((a.stars || 0) + (a.forks || 0))
//             )
//             .slice(0, 6);
//           setFeaturedRepos(featured);
//         }

//         setIsLoading(false)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         toast.error("Failed to load profile data")
//         setIsLoading(false)
//       }
//     }

//     fetchRepos()
//   }, [])

//   const handleRefresh = () => {
//     setIsLoading(true)
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false)
//       toast.success("Analysis refreshed successfully")
//     }, 1500)
//   }

//   if (isLoading || !data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9d2e9] border-t-[#8a3ffc]"></div>
//           <p className="text-lg font-medium text-[#d9d2e9]">Loading profile data...</p>
//         </div>
//       </div>
//     )
//   }
//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: 'My Profile Analysis',
//           text: 'Check out this cool profile analysis!',
//           url: window.location.href,
//         });
//       } else {
//         // fallback for browsers that don't support Web Share API
//         await navigator.clipboard.writeText(window.location.href);
//         alert("Link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };
//   // Calculate profile score based on various metrics - Enhanced version
//   const calculateScore = () => {
//     let score = 0
//     let maxScore = 0

//     // GitHub metrics (max 60 points)
//     const repoCount = data.github_analysis.repositories.length
//     const repoScore = Math.min(repoCount * 2, 20) // Max 20 points for repos
//     score += repoScore
//     maxScore += 20

//     const contributionCount = data.github_analysis.total_contributions
//     const contributionScore = Math.min(contributionCount * 0.2, 15) // Max 15 points for contributions
//     score += contributionScore
//     maxScore += 15

//     const totalStars = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)
//     const starsScore = Math.min(totalStars * 0.5, 10) // Max 10 points for stars
//     score += starsScore
//     maxScore += 10

//     const totalForks = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)
//     const forksScore = Math.min(totalForks * 0.5, 5) // Max 5 points for forks
//     score += forksScore
//     maxScore += 5

//     const followersScore = Math.min(data.github_analysis.followers * 0.5, 5) // Max 5 points for followers
//     score += followersScore
//     maxScore += 5

//     const languageCount = data.github_analysis.most_used_languages.length
//     const languageScore = Math.min(languageCount * 1, 5) // Max 5 points for language diversity
//     score += languageScore
//     maxScore += 5

//     // LeetCode metrics (max 40 points)
//     const leetcodeSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "All",
//       )?.count ?? 0
//     const leetcodeSolvedScore = Math.min(leetcodeSolved * 0.2, 10) // Max 10 points for total solved
//     score += leetcodeSolvedScore
//     maxScore += 10

//     // Medium and Hard problems give bonus points
//     const mediumSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Medium",
//       )?.count ?? 0
//     const mediumScore = Math.min(mediumSolved * 0.5, 15) // Max 15 points for medium problems
//     score += mediumScore
//     maxScore += 15

//     const hardSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Hard",
//       )?.count ?? 0
//     const hardScore = Math.min(hardSolved * 1, 15) // Max 15 points for hard problems
//     score += hardScore
//     maxScore += 15

//     // Calculate final percentage score
//     return Math.min(Math.round((score / maxScore) * 100), 100)
//   }

//   const profileScore = calculateScore()

//   // Calculate GitHub performance score
//   const calculateGitHubScore = () => {
//     let score = 0
//     const repoCount = data.github_analysis.repositories.length
//     score += Math.min(repoCount * 3, 30)

//     const contributionCount = data.github_analysis.total_contributions
//     score += Math.min(contributionCount * 0.3, 30)

//     const totalStars = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)
//     score += Math.min(totalStars * 1, 20)

//     const totalForks = data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)
//     score += Math.min(totalForks * 1, 10)

//     const followersScore = Math.min(data.github_analysis.followers * 1, 10)
//     score += followersScore

//     return Math.min(score, 100)
//   }

//   // Calculate LeetCode performance score
//   const calculateLeetCodeScore = () => {
//     let score = 0

//     const leetcodeSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "All",
//       )?.count ?? 0
//     score += Math.min(leetcodeSolved * 0.5, 40)

//     const mediumSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Medium",
//       )?.count ?? 0
//     score += Math.min(mediumSolved * 1, 30)

//     const hardSolved =
//       data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//         (x) => x.difficulty === "Hard",
//       )?.count ?? 0
//     score += Math.min(hardSolved * 2, 30)

//     return Math.min(score, 100)
//   }

//   const githubScore = calculateGitHubScore()
//   const leetcodeScore = calculateLeetCodeScore()

//   // Get top skills from LeetCode topics
//   const getTopSkillsByCategory = (category: "fundamental" | "intermediate" | "advanced") => {
//     const topics = data.leetcode_analysis.topics.data?.matchedUser?.tagProblemCounts
//     if (!topics) return []

//     return topics[category]
//       .sort((a, b) => b.problemsSolved - a.problemsSolved)
//       .slice(0, 5)
//       .map((topic) => ({
//         name: topic.tagName,
//         count: topic.problemsSolved,
//       }))
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative">
//       {/* Spotlight effects */}
//       <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
//       <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
//       <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>

//       <header className="sticky top-0 z-50 w-full border-b border-[#d9d2e9]/10 bg-[#1e0a3c]/80 backdrop-blur-sm">
//         <div className="container flex h-20 items-center">
//           <div className="mr-4 flex">
//             <Link href="/" className="mr-6 flex items-center space-x-2">
//               <Code2 className="h-8 w-8 text-[#d9d2e9]" />
//               <span className="font-bold text-xl text-[#d9d2e9] sm:inline-block">DevProfiler</span>
//             </Link>
//             <nav className="flex items-center space-x-6 text-base font-medium">
//               <Link href="/dashboard" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
//                 Dashboard
//               </Link>
//               <Link href="/history" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
//                 History
//               </Link>
//               <Link href="/settings" className="text-[#d9d2e9]/80 transition-colors hover:text-[#d9d2e9] text-lg">
//                 Settings
//               </Link>
//             </nav>
//           </div>
//           <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-auto text-[#d9d2e9] hover:bg-white/10"
//               onClick={handleRefresh}
//               disabled={isLoading}
//             >
//               <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//               {isLoading ? "Refreshing..." : "Refresh Analysis"}
//             </Button>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1 py-8 relative z-10">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-8">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <div className="inline-flex items-center rounded-full border border-[#d9d2e9]/20 bg-[#8a3ffc]/10 px-3 py-1 text-sm text-[#d9d2e9] backdrop-blur-sm mb-2">
//                   <Sparkles className="mr-1 h-3.5 w-3.5 text-[#8a3ffc]" />
//                   <span>Analysis Complete</span>
//                 </div>
//                 <h1 className="text-3xl font-bold tracking-tight text-[#d9d2e9]">
//                   {data.github_analysis.name}'s Profile
//                 </h1>
//                 <p className="text-[#d9d2e9]/70">
//                   Last updated:{" "}
//                   {new Date(data.github_analysis.updated_at).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//               <Button
//   variant="ghost"
//   size="sm"
//   className="text-[#d9d2e9] hover:bg-white/10"
//   onClick={handleShare}
// >
//   <Share2 className="mr-2 h-4 w-4" />
//   Share
// </Button>

//                 <Button variant="ghost" size="sm" className="text-[#d9d2e9] hover:bg-white/10">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export PDF
//                 </Button>
//               </div>
//             </div>

//             <div className="grid gap-6 md:grid-cols-3">
//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">Recruiter Readiness</CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">Overall profile score</CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <div className="relative h-36 w-36">
//                       <svg className="h-full w-full" viewBox="0 0 100 100">
//                         <circle
//                           className="stroke-[#d9d2e9]/20"
//                           cx="50"
//                           cy="50"
//                           r="40"
//                           fill="transparent"
//                           strokeWidth="10"
//                         />
//                         <circle
//                           className="stroke-[#8a3ffc]"
//                           cx="50"
//                           cy="50"
//                           r="40"
//                           fill="transparent"
//                           strokeWidth="10"
//                           strokeDasharray={`${profileScore * 2.51} 251`}
//                           strokeDashoffset="0"
//                           transform="rotate(-90 50 50)"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-4xl font-bold text-[#d9d2e9]">{profileScore}</span>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm font-medium text-[#d9d2e9]">
//                         {profileScore >= 80
//                           ? "Excellent"
//                           : profileScore >= 60
//                             ? "Good"
//                             : profileScore >= 40
//                               ? "Average"
//                               : "Needs Improvement"}
//                       </p>
//                       <p className="text-xs text-[#d9d2e9]/70">
//                         {profileScore >= 70
//                           ? "Top 25% of developers"
//                           : profileScore >= 50
//                             ? "Top 50% of developers"
//                             : "Building foundations"}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">Platform Breakdown</CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">Performance across platforms</CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Github className="h-4 w-4 text-[#d9d2e9]" />
//                           <span className="text-sm font-medium text-[#d9d2e9]">GitHub</span>
//                         </div>
//                         <span className="text-sm font-medium text-[#d9d2e9]">{githubScore}/100</span>
//                       </div>
//                       <Progress value={githubScore} className="h-2 bg-[#d9d2e9]/10" />
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Code2 className="h-4 w-4 text-[#d9d2e9]" />
//                           <span className="text-sm font-medium text-[#d9d2e9]">LeetCode</span>
//                         </div>
//                         <span className="text-sm font-medium text-[#d9d2e9]">{leetcodeScore}/100</span>
//                       </div>
//                       <Progress value={leetcodeScore} className="h-2 bg-[#d9d2e9]/10" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <CardHeader className="pb-2 relative z-10">
//                   <CardTitle className="text-lg text-[#d9d2e9]">Skill Assessment</CardTitle>
//                   <CardDescription className="text-[#d9d2e9]/70">Top skills based on your profiles</CardDescription>
//                 </CardHeader>
//                 <CardContent className="relative z-10">
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map((skill, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
//                       >
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
//               <TabsList className="bg-[#d9d2e9]/10 text-[#d9d2e9]">
//                 <TabsTrigger
//                   value="overview"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   Overview
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="github"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   GitHub
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="coding"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   LeetCode
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="recommendations"
//                   className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
//                 >
//                   Recommendations
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Strengths</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">Areas where your profile excels</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {insights.strengths.map((strength, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                             <span className="text-[#d9d2e9]">{strength}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Areas for Improvement</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Opportunities to enhance your profile
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {insights.weaknesses.map((weakness, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
//                             <span className="text-[#d9d2e9]">{weakness}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">Peer Comparison</CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       How you compare to other developers in your field
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">GitHub Activity</span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             {githubScore >= 70 ? "Above Average" : githubScore >= 40 ? "Average" : "Below Average"}
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div
//                             className="absolute h-full rounded-full bg-[#8a3ffc]"
//                             style={{ width: `${githubScore}%` }}
//                           />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div
//                             className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
//                             style={{ left: `${githubScore}%` }}
//                           />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">Problem Solving Skills</span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             {leetcodeScore >= 70 ? "Above Average" : leetcodeScore >= 40 ? "Average" : "Below Average"}
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div
//                             className="absolute h-full rounded-full bg-[#8a3ffc]"
//                             style={{ width: `${leetcodeScore}%` }}
//                           />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div
//                             className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
//                             style={{ left: `${leetcodeScore}%` }}
//                           />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-[#d9d2e9]">Overall Profile Strength</span>
//                           <span className="text-sm font-medium text-[#d9d2e9]">
//                             {profileScore >= 70 ? "Above Average" : profileScore >= 40 ? "Average" : "Below Average"}
//                           </span>
//                         </div>
//                         <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
//                           <div
//                             className="absolute h-full rounded-full bg-[#8a3ffc]"
//                             style={{ width: `${profileScore}%` }}
//                           />
//                           <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
//                           <div
//                             className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
//                             style={{ left: `${profileScore}%` }}
//                           />
//                         </div>
//                         <div className="flex justify-between text-xs text-[#d9d2e9]/70">
//                           <span>Below Average</span>
//                           <span>Average</span>
//                           <span>Above Average</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="github" className="space-y-4">
//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">GitHub Profile</CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       <a
//                         href={data.github_analysis.profile_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1 hover:text-[#8a3ffc] transition-colors"
//                       >
//                         {data.github_analysis.profile_url.split("github.com/")[1]}
//                         <ExternalLink className="h-3 w-3" />
//                       </a>
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <h3 className="text-sm font-medium text-[#d9d2e9]">Bio</h3>
//                         <p className="text-sm text-[#d9d2e9]/80">{data.github_analysis.bio || "No bio provided"}</p>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <Users className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.followers}</span>
//                           <span className="text-xs text-[#d9d2e9]/70">Followers</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <Users className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.following}</span>
//                           <span className="text-xs text-[#d9d2e9]/70">Following</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <FileCode className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">{data.github_analysis.public_repos}</span>
//                           <span className="text-xs text-[#d9d2e9]/70">Repositories</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <Star className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">
//                             {data.github_analysis.repositories.reduce((acc, repo) => acc + repo.stars, 0)}
//                           </span>
//                           <span className="text-xs text-[#d9d2e9]/70">Total Stars</span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <GitFork className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">
//                             {data.github_analysis.repositories.reduce((acc, repo) => acc + repo.forks, 0)}
//                           </span>
//                           <span className="text-xs text-[#d9d2e9]/70">Total Forks</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <Calendar className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">
//                             {new Date(data.github_analysis.created_at).getFullYear()}
//                           </span>
//                           <span className="text-xs text-[#d9d2e9]/70">Joined Year</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <TrendingUp className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">
//                             {data.github_analysis.total_contributions}
//                           </span>
//                           <span className="text-xs text-[#d9d2e9]/70">Contributions</span>
//                         </div>
//                         <div className="flex flex-col items-center justify-center rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-3">
//                           <Code2 className="h-5 w-5 text-[#d9d2e9]/70 mb-1" />
//                           <span className="text-lg font-bold text-[#d9d2e9]">
//                             {data.github_analysis.most_used_languages.length}
//                           </span>
//                           <span className="text-xs text-[#d9d2e9]/70">Languages</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">Language Distribution</CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Languages used across your repositories
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="space-y-4">
//                       {languageDistribution.map((language, index) => (
//                         <div key={index} className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-[#d9d2e9]">{language.name || "Unknown"}</span>
//                             <span className="text-sm font-medium text-[#d9d2e9]">{language.percentage}%</span>
//                           </div>
//                           <Progress value={language.percentage} className="h-2 bg-[#d9d2e9]/10" />
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">Featured Projects</CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Highlighted repositories from your GitHub
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                       {featuredRepos.map((repo, index) => (
//                         <div
//                           key={index}
//                           className="rounded-lg border border-[#d9d2e9]/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <h3 className="font-medium text-[#d9d2e9]">{repo.name}</h3>
//                               <p className="text-sm text-[#d9d2e9]/70 mt-1 line-clamp-2">
//                                 {repo.description || "No description provided"}
//                               </p>
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className="text-xs bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
//                             >
//                               {repo.language || "Unknown"}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-4 mt-3 text-xs text-[#d9d2e9]/70">
//                             <div className="flex items-center">
//                               <Star className="h-4 w-4 mr-1 text-[#d9d2e9]/50" />
//                               <span>{repo.stars}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <GitFork className="h-4 w-4 mr-1 text-[#d9d2e9]/50" />
//                               <span>{repo.forks}</span>
//                             </div>
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               href={repo.repo_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-xs text-[#8a3ffc] hover:text-[#a66eff] flex items-center gap-1"
//                             >
//                               View Repository <ExternalLink className="h-3 w-3" />
//                             </a>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="coding" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">Problems Solved</CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                           (x) => x.difficulty === "All",
//                         )?.count || 0}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">Total solved problems</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">Contest Rating</CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.leetcode_analysis.contest_history.data?.userContestRanking?.rating || "N/A"}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">Current rating</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">Global Ranking</CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         #{data.leetcode_analysis.profile.data.matchedUser.profile.ranking.toLocaleString()}
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">Worldwide position</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="pb-2 relative z-10">
//                       <CardTitle className="text-sm font-medium text-[#d9d2e9]">Top Percentage</CardTitle>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="text-2xl font-bold text-[#d9d2e9]">
//                         {data.leetcode_analysis.contest_history.data?.userContestRanking?.topPercentage?.toFixed(1) ||
//                           "N/A"}
//                         %
//                       </div>
//                       <p className="text-xs text-[#d9d2e9]/70">Among all participants</p>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <CardHeader className="relative z-10">
//                     <CardTitle className="text-[#d9d2e9]">Problem Difficulty Breakdown</CardTitle>
//                     <CardDescription className="text-[#d9d2e9]/70">
//                       Distribution of solved problems by difficulty
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="relative z-10">
//                     <div className="flex h-60 items-end gap-2">
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-green-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Easy",
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                   (x) => x.difficulty === "Easy",
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">Easy</span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Easy",
//                             )?.count || 0}
//                             <span className="text-xs text-[#d9d2e9]/70">
//                               /
//                               {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                 (x) => x.difficulty === "Easy",
//                               )?.count || 0}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-yellow-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Medium",
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                   (x) => x.difficulty === "Medium",
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">Medium</span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Medium",
//                             )?.count || 0}
//                             <span className="text-xs text-[#d9d2e9]/70">
//                               /
//                               {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                 (x) => x.difficulty === "Medium",
//                               )?.count || 0}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                       <div className="relative flex h-full flex-1 flex-col justify-end">
//                         <div
//                           className="bg-red-500/80 rounded-t-md w-full"
//                           style={{
//                             height: `${
//                               ((data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                 (x) => x.difficulty === "Hard",
//                               )?.count || 0) /
//                                 (data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                   (x) => x.difficulty === "Hard",
//                                 )?.count || 1)) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                         <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
//                           <span className="text-xs font-medium text-[#d9d2e9]">Hard</span>
//                           <p className="text-sm font-bold text-[#d9d2e9]">
//                             {data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                               (x) => x.difficulty === "Hard",
//                             )?.count || 0}
//                             <span className="text-xs text-[#d9d2e9]/70">
//                               /
//                               {data.leetcode_analysis.solved_stats.data.allQuestionsCount.find(
//                                 (x) => x.difficulty === "Hard",
//                               )?.count || 0}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Programming Languages</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">Languages used to solve problems</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <div className="space-y-4">
//                         {data.leetcode_analysis.language_stats.data.matchedUser.languageProblemCount
//                           .slice(0, 5)
//                           .map((lang, index) => (
//                             <div key={index} className="space-y-2">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium text-[#d9d2e9]">{lang.languageName}</span>
//                                 <span className="text-sm font-medium text-[#d9d2e9]">
//                                   {lang.problemsSolved} problems
//                                 </span>
//                               </div>
//                               <Progress
//                                 value={
//                                   (lang.problemsSolved /
//                                     (data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
//                                       (x) => x.difficulty === "All",
//                                     )?.count || 1)) *
//                                   100
//                                 }
//                                 className="h-2 bg-[#d9d2e9]/10"
//                               />
//                             </div>
//                           ))}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Badges Earned</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">Achievements on LeetCode</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       {data.leetcode_analysis.badges.data?.matchedUser?.badges?.length > 0 ? (
//                         <div className="grid grid-cols-2 gap-3">
//                           {data.leetcode_analysis.badges.data.matchedUser.badges.map((badge, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-2 p-2 rounded-lg border border-[#d9d2e9]/10 bg-white/5"
//                             >
//                               <Award className="h-5 w-5 text-[#8a3ffc]" />
//                               <div>
//                                 <p className="text-sm font-medium text-[#d9d2e9]">{badge.displayName}</p>
//                                 <p className="text-xs text-[#d9d2e9]/70">{badge.name}</p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="flex flex-col items-center justify-center py-6">
//                           <Award className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
//                           <p className="text-sm text-[#d9d2e9]/70">No badges earned yet</p>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-3">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Fundamental Skills</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">Basic programming concepts</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {getTopSkillsByCategory("fundamental").map((skill, index) => (
//                           <li key={index} className="flex items-center justify-between">
//                             <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
//                             <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
//                               {skill.count}
//                             </Badge>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Intermediate Skills</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">Advanced programming concepts</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {getTopSkillsByCategory("intermediate").map((skill, index) => (
//                           <li key={index} className="flex items-center justify-between">
//                             <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
//                             <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
//                               {skill.count}
//                             </Badge>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-[#d9d2e9]">Advanced Skills</CardTitle>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Complex algorithms and data structures
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-2">
//                         {getTopSkillsByCategory("advanced").map((skill, index) => (
//                           <li key={index} className="flex items-center justify-between">
//                             <span className="text-sm text-[#d9d2e9]">{skill.name}</span>
//                             <Badge variant="outline" className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20">
//                               {skill.count}
//                             </Badge>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               <TabsContent value="recommendations" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <Briefcase className="h-5 w-5 text-[#8a3ffc]" />
//                         <CardTitle className="text-[#d9d2e9]">Project Suggestions</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">Based on your current skillset</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         {projectSuggestions.map((suggestion, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                             <span className="text-[#d9d2e9]">{suggestion}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <AlertTriangle className="h-5 w-5 text-amber-500" />
//                         <CardTitle className="text-[#d9d2e9]">Skill Gaps</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">Areas to focus on for improvement</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         {insights.weaknesses.slice(0, 4).map((weakness, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
//                             <span className="text-[#d9d2e9]">{weakness}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <BookOpen className="h-5 w-5 text-[#8a3ffc]" />
//                         <CardTitle className="text-[#d9d2e9]">Documentation & Presentation</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Improve how you showcase your work
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         {data.github_analysis.repositories.some((repo) => !repo.description) && (
//                           <li className="flex items-start gap-2">
//                             <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                             <span className="text-[#d9d2e9]">
//                               Add descriptions to all your repositories to make them more discoverable
//                             </span>
//                           </li>
//                         )}
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Create comprehensive README files with setup instructions and screenshots
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Pin your best repositories to your GitHub profile to highlight your best work
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Create a personal portfolio website to showcase your projects in a more visual way
//                           </span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-5 w-5 text-[#8a3ffc]" />
//                         <CardTitle className="text-[#d9d2e9]">Community & Collaboration</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">
//                         Enhance your network and collaborative skills
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Contribute to open-source projects to build your network and gain experience
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Participate in LeetCode contests to improve your problem-solving skills
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Share your knowledge through blog posts or technical articles
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Join developer communities and forums to connect with other professionals
//                           </span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                         <CardTitle className="text-[#d9d2e9]">Code Quality Tips</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">Improve your coding practices</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
//                           <span className="text-[#d9d2e9]">
//                             Use consistent coding styles and follow language-specific conventions
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
//                           <span className="text-[#d9d2e9]">
//                             Write semantic commit messages (e.g., "feat: add login form")
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
//                           <span className="text-[#d9d2e9]">Implement unit tests to ensure code reliability</span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
//                           <span className="text-[#d9d2e9]">
//                             Use linters and code formatters to maintain code quality
//                           </span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <CardHeader className="relative z-10">
//                       <div className="flex items-center gap-2">
//                         <TrendingUp className="h-5 w-5 text-[#8a3ffc]" />
//                         <CardTitle className="text-[#d9d2e9]">Growth Opportunities</CardTitle>
//                       </div>
//                       <CardDescription className="text-[#d9d2e9]/70">Next steps for career advancement</CardDescription>
//                     </CardHeader>
//                     <CardContent className="relative z-10">
//                       <ul className="space-y-3">
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Explore{" "}
//                             {data.github_analysis.most_used_languages.length < 3
//                               ? "more programming languages"
//                               : "advanced concepts in your preferred languages"}
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">
//                             Build projects that demonstrate full-stack capabilities
//                           </span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">Learn about cloud services and deployment strategies</span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
//                           <span className="text-[#d9d2e9]">Practice system design and architecture principles</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </main>
//       <footer className="w-full border-t border-[#d9d2e9]/10 py-6 bg-[#1e0a3c] relative z-10">
//         <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
//           <p className="text-center text-sm text-[#d9d2e9]/50 md:text-left">© 2025 DevProfiler. All rights reserved.</p>
//           <div className="flex gap-4">
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Terms
//             </Link>
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Privacy
//             </Link>
//             <Link href="#" className="text-[#d9d2e9]/50 hover:text-[#d9d2e9]">
//               Contact
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }













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
  Linkedin,
  GraduationCapIcon as Graduation,
  Languages,
  BadgeIcon as Certificate,
  Trophy,
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

interface LinkedinEducation {
  starts_at?: {
    day?: number
    month?: number
    year?: number
  }
  ends_at?: {
    day?: number
    month?: number
    year?: number
  }
  field_of_study?: string
  degree_name?: string
  school?: string
  description?: string
}

interface LinkedinExperience {
  starts_at?: {
    day?: number
    month?: number
    year?: number
  }
  ends_at?: {
    day?: number
    month?: number
    year?: number
  }
  company?: string
  title?: string
  description?: string
  location?: string
}

interface LinkedinCertification {
  name?: string
  authority?: string
  starts_at?: {
    day?: number
    month?: number
    year?: number
  }
  ends_at?: {
    day?: number
    month?: number
    year?: number
  }
  url?: string
}

interface LinkedinAnalysis {
  full_name: string
  headline: string
  summary: string
  occupation: string
  connections: number
  followers: number
  profile_pic: string
  location: string
  education: LinkedinEducation[]
  experiences: LinkedinExperience[]
  skills: string[]
  certifications: LinkedinCertification[]
  languages: string[]
  accomplishments: string[]
  interests: string[]
  volunteer_work: any[]
  profile_url: string
  error?: string
}

interface ApiResponse {
  github_analysis: GithubAnalysis
  leetcode_analysis: LeetcodeAnalysis
  linkedin_analysis?: LinkedinAnalysis
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

  // Add LinkedIn skills
  if (data.linkedin_analysis?.skills) {
    data.linkedin_analysis.skills.slice(0, 10).forEach((skill) => {
      if (skill) skills.add(skill)
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
  const linkedin = data.linkedin_analysis

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

  // LinkedIn strengths
  if (linkedin) {
    if (linkedin.experiences && linkedin.experiences.length > 2)
      strengths.push("Diverse work experience across multiple roles")
    if (linkedin.education && linkedin.education.length > 1)
      strengths.push("Strong educational background with multiple qualifications")
    if (linkedin.skills && linkedin.skills.length > 10) strengths.push("Broad skill set demonstrated on LinkedIn")
    if (linkedin.certifications && linkedin.certifications.length > 0)
      strengths.push("Professional certifications that validate expertise")
    if (linkedin.followers && linkedin.followers > 500)
      strengths.push("Strong professional network with significant LinkedIn following")
    if (linkedin.accomplishments && linkedin.accomplishments.length > 0)
      strengths.push("Notable professional accomplishments")
  }

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

  // LinkedIn weaknesses
  if (linkedin) {
    if (!linkedin.summary || linkedin.summary.length < 50) weaknesses.push("LinkedIn profile lacks a detailed summary")
    if (!linkedin.skills || linkedin.skills.length < 5) weaknesses.push("Few skills listed on LinkedIn profile")
    if (!linkedin.experiences || linkedin.experiences.length === 0)
      weaknesses.push("No work experience listed on LinkedIn")
    if (linkedin.connections < 100) weaknesses.push("Limited professional network on LinkedIn")
  } else {
    weaknesses.push("LinkedIn profile not connected — add it for a complete analysis")
  }

  return { strengths, weaknesses }
}

// Generate project suggestions based on skills
const generateProjectSuggestions = (data: ApiResponse): string[] => {
  const suggestions: string[] = []
  const languages = data.github_analysis.most_used_languages
  const linkedinSkills = data.linkedin_analysis?.skills || []

  if (languages.includes("JavaScript") || languages.includes("TypeScript") || linkedinSkills.includes("JavaScript")) {
    suggestions.push("Build a full-stack application using Next.js with server components and API routes")
    suggestions.push("Create a real-time chat application with WebSockets or Firebase")
  }

  if (languages.includes("Python") || linkedinSkills.includes("Python")) {
    suggestions.push("Develop a REST API with FastAPI or Django REST framework")
    suggestions.push("Build a data analysis dashboard with Pandas and Plotly/Dash")
  }

  if (languages.includes("Java") || languages.includes("C#") || linkedinSkills.includes("Java")) {
    suggestions.push("Create a microservices architecture with Spring Boot/ASP.NET Core")
    suggestions.push("Develop an enterprise-level application with proper authentication and authorization")
  }

  // Add general suggestions
  suggestions.push("Contribute to open-source projects to increase visibility and collaboration experience")
  suggestions.push("Create a personal portfolio website to showcase your projects and skills")

  return suggestions.slice(0, 3) // Return top 3 suggestions
}

// Mock data for development and when API is unavailable
const getMockData = () => {
  return {
    github_analysis: {
      bio: "Software developer passionate about web technologies",
      blog: "https://example.com/blog",
      company: "Tech Company",
      created_at: "2020-01-01T00:00:00Z",
      followers: 25,
      following: 30,
      location: "San Francisco, CA",
      most_used_languages: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"],
      name: "Developer Name",
      profile_url: "https://github.com/username",
      public_repos: 15,
      repositories: [
        {
          description: "A personal portfolio website",
          forks: 2,
          language: "JavaScript",
          name: "portfolio",
          repo_url: "https://github.com/username/portfolio",
          stars: 5,
        },
        {
          description: "A React component library",
          forks: 3,
          language: "TypeScript",
          name: "react-components",
          repo_url: "https://github.com/username/react-components",
          stars: 10,
        },
        {
          description: "Data analysis tools",
          forks: 1,
          language: "Python",
          name: "data-tools",
          repo_url: "https://github.com/username/data-tools",
          stars: 3,
        },
      ],
      total_contributions: 100,
      updated_at: "2023-01-01T00:00:00Z",
    },
    leetcode_analysis: {
      badges: {
        data: {
          matchedUser: {
            badges: [
              {
                id: "1",
                name: "Problem Solver",
                displayName: "Problem Solver",
              },
            ],
          },
        },
      },
      contest_history: {
        data: {
          userContestRanking: {
            attendedContestsCount: 5,
            rating: 1500,
            globalRanking: 10000,
            totalParticipants: 100000,
            topPercentage: 10,
          },
        },
      },
      language_stats: {
        data: {
          matchedUser: {
            languageProblemCount: [
              {
                languageName: "JavaScript",
                problemsSolved: 50,
              },
              {
                languageName: "Python",
                problemsSolved: 30,
              },
            ],
          },
        },
      },
      profile: {
        data: {
          matchedUser: {
            profile: {
              aboutMe: "Passionate coder",
              countryName: "United States",
              ranking: 50000,
              realName: "Developer Name",
              reputation: 100,
            },
            username: "username",
          },
        },
      },
      solved_stats: {
        data: {
          allQuestionsCount: [
            {
              count: 2000,
              difficulty: "All",
            },
            {
              count: 500,
              difficulty: "Easy",
            },
            {
              count: 1000,
              difficulty: "Medium",
            },
            {
              count: 500,
              difficulty: "Hard",
            },
          ],
          matchedUser: {
            submitStatsGlobal: {
              acSubmissionNum: [
                {
                  count: 100,
                  difficulty: "All",
                },
                {
                  count: 50,
                  difficulty: "Easy",
                },
                {
                  count: 40,
                  difficulty: "Medium",
                },
                {
                  count: 10,
                  difficulty: "Hard",
                },
              ],
            },
          },
        },
      },
      topics: {
        data: {
          matchedUser: {
            tagProblemCounts: {
              advanced: [
                {
                  tagName: "Dynamic Programming",
                  problemsSolved: 5,
                },
              ],
              fundamental: [
                {
                  tagName: "Array",
                  problemsSolved: 20,
                },
                {
                  tagName: "String",
                  problemsSolved: 15,
                },
              ],
              intermediate: [
                {
                  tagName: "Tree",
                  problemsSolved: 10,
                },
                {
                  tagName: "Graph",
                  problemsSolved: 8,
                },
              ],
            },
          },
        },
      },
    },
    linkedin_analysis: {
      full_name: "Developer Name",
      headline: "Software Engineer at Tech Company",
      summary: "Experienced software engineer with a passion for building scalable web applications.",
      occupation: "Software Engineer",
      connections: 500,
      followers: 200,
      profile_pic: "https://via.placeholder.com/150",
      location: "San Francisco, CA",
      education: [
        {
          school: "University of Technology",
          degree_name: "Bachelor of Science",
          field_of_study: "Computer Science",
          starts_at: { year: 2016 },
          ends_at: { year: 2020 },
        },
      ],
      experiences: [
        {
          company: "Tech Company",
          title: "Software Engineer",
          starts_at: { year: 2020, month: 6 },
          ends_at: null,
          description: "Developing web applications using React and Node.js",
        },
        {
          company: "Startup Inc",
          title: "Junior Developer",
          starts_at: { year: 2018, month: 5 },
          ends_at: { year: 2020, month: 5 },
          description: "Worked on frontend development with JavaScript and CSS",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Git", "MongoDB", "SQL", "Python"],
      certifications: [
        {
          name: "AWS Certified Developer",
          authority: "Amazon Web Services",
          starts_at: { year: 2021 },
        },
      ],
      languages: ["English", "Spanish"],
      accomplishments: ["Published technical articles", "Open source contributor"],
      interests: ["Web Development", "Machine Learning", "Data Science"],
      volunteer_work: [],
      profile_url: "https://linkedin.com/in/username",
    },
  }
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
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true)
      setApiError(null)

      try {
        const github = localStorage.getItem("github")
        const leetcode = localStorage.getItem("leetcode")
        const linkedin = localStorage.getItem("linkedin")

        if (!github || !leetcode) {
          // If usernames are not available, redirect to analyze page
          window.location.href = "/analyze"
          return
        }

        // Try to fetch from API
        let result
        try {
          // Build the API URL with all parameters
          let apiUrl = `http://127.0.0.1:5000/api?`
          if (github) apiUrl += `github_username=${encodeURIComponent(github)}&`
          if (leetcode) apiUrl += `leetcode_username=${encodeURIComponent(leetcode)}&`
          if (linkedin) apiUrl += `linkedin_username=${encodeURIComponent(linkedin)}`
          
          console.log("All data URL:", apiUrl)
          
          // LinkedIn only
          let linkedinUrl = `http://127.0.0.1:5000/api?`
          if (linkedin) linkedinUrl += `linkedin_username=${encodeURIComponent(linkedin)}`
          console.log("LinkedIn-only URL:", linkedinUrl)
  
  

          // Use fetch with credentials included and a timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          const res = await fetch(apiUrl, {
            method: "GET",
            signal: controller.signal,
            // credentials: "include", // Optional: only if using cookies + CORS
            headers: {
              Accept: "application/json",
            },
          })


          // const res = await fetch(apiUrl, {
          //   method: "GET",
          //   signal: controller.signal,
          //   // credentials: "include", // Optional: only if using cookies + CORS
          //   headers: {
          //     Accept: "application/json",
          //   },
          // })

          clearTimeout(timeoutId)

          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status} ${res.statusText}`)
          }

          result = await res.json()
          console.log("API Response:", result)
        } catch (fetchError: any) {
          console.error("API fetch error:", fetchError)

          // If we're in development or the API is unavailable, use mock data
          if (process.env.NODE_ENV === "development" || fetchError.message.includes("Failed to fetch")) {
            console.log("Using mock data due to API unavailability")
            result = getMockData()
            setApiError("Could not connect to the API server. Using demo data for preview.")
          } else {
            throw fetchError // Re-throw if it's not a connection issue
          }
        }

        // Set the data from the API response or mock data
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
            .filter(
              (repo: Repository) =>
                (repo.stars || 0) > 0 || (repo.forks || 0) > 0 || (repo.description || "").trim().length > 0,
            )
            .sort((a: Repository, b: Repository) => (b.stars || 0) + (b.forks || 0) - ((a.stars || 0) + (a.forks || 0)))
            .slice(0, 6)
          setFeaturedRepos(featured)
        }
      } catch (error: any) {
        console.error("Error processing data:", error)
        setApiError(error.message || "An unknown error occurred")
        toast.error("Failed to load profile data: " + (error.message || "Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    // Reload the data
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9d2e9] border-t-[#8a3ffc]"></div>
          <p className="text-lg font-medium text-[#d9d2e9]">Loading profile data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e0a3c] to-[#3c1053]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-bold text-[#d9d2e9]">Failed to Load Data</h2>
          <p className="text-[#d9d2e9]/80">
            {apiError || "We couldn't load your profile data. Please check your connection and try again."}
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => (window.location.href = "/analyze")} className="bg-[#8a3ffc]">
              Update Profiles
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="border-[#d9d2e9]/20 text-[#d9d2e9]">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate profile score based on various metrics - Enhanced version
  const calculateScore = () => {
    let score = 0
    let maxScore = 0

    // GitHub metrics (max 50 points)
    const repoCount = data.github_analysis.repositories.length
    const repoScore = Math.min(repoCount * 2, 15) // Max 15 points for repos
    score += repoScore
    maxScore += 15

    const contributionCount = data.github_analysis.total_contributions
    const contributionScore = Math.min(contributionCount * 0.2, 10) // Max 10 points for contributions
    score += contributionScore
    maxScore += 10

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

    // LeetCode metrics (max 30 points)
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
    const mediumScore = Math.min(mediumSolved * 0.5, 10) // Max 10 points for medium problems
    score += mediumScore
    maxScore += 10

    const hardSolved =
      data.leetcode_analysis.solved_stats.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
        (x) => x.difficulty === "Hard",
      )?.count ?? 0
    const hardScore = Math.min(hardSolved * 1, 10) // Max 10 points for hard problems
    score += hardScore
    maxScore += 10

    // LinkedIn metrics (max 20 points)
    if (data.linkedin_analysis && !data.linkedin_analysis.error) {
      // Skills
      const skillsCount = data.linkedin_analysis.skills?.length || 0
      const skillsScore = Math.min(skillsCount * 0.5, 5) // Max 5 points for skills
      score += skillsScore
      maxScore += 5

      // Experience
      const experienceCount = data.linkedin_analysis.experiences?.length || 0
      const experienceScore = Math.min(experienceCount * 2, 5) // Max 5 points for experience
      score += experienceScore
      maxScore += 5

      // Education
      const educationCount = data.linkedin_analysis.education?.length || 0
      const educationScore = Math.min(educationCount * 2, 5) // Max 5 points for education
      score += educationScore
      maxScore += 5

      // Certifications
      const certificationCount = data.linkedin_analysis.certifications?.length || 0
      const certificationScore = Math.min(certificationCount * 2, 5) // Max 5 points for certifications
      score += certificationScore
      maxScore += 5
    } else {
      maxScore += 20 // Add LinkedIn max score even if not available
    }

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

  // Calculate LinkedIn performance score
  const calculateLinkedInScore = () => {
    if (!data.linkedin_analysis || data.linkedin_analysis.error) {
      return 0
    }

    let score = 0

    // Profile completeness
    if (data.linkedin_analysis.summary) score += 10
    if (data.linkedin_analysis.headline) score += 5
    if (data.linkedin_analysis.profile_pic) score += 5

    // Skills
    const skillsCount = data.linkedin_analysis.skills?.length || 0
    score += Math.min(skillsCount * 2, 20)

    // Experience
    const experienceCount = data.linkedin_analysis.experiences?.length || 0
    score += Math.min(experienceCount * 10, 30)

    // Education
    const educationCount = data.linkedin_analysis.education?.length || 0
    score += Math.min(educationCount * 10, 20)

    // Certifications
    const certificationCount = data.linkedin_analysis.certifications?.length || 0
    score += Math.min(certificationCount * 5, 10)

    return Math.min(score, 100)
  }

  const githubScore = calculateGitHubScore()
  const leetcodeScore = calculateLeetCodeScore()
  const linkedinScore = calculateLinkedInScore()

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

  // Format date from LinkedIn data
  const formatDate = (dateObj?: { year?: number; month?: number }) => {
    if (!dateObj || !dateObj.year) return "Present"

    const month = dateObj.month ? new Date(0, dateObj.month - 1).toLocaleString("default", { month: "short" }) : ""
    return `${month} ${dateObj.year}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#1e0a3c] to-[#3c1053] relative">
      {/* Spotlight effects */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#8a3ffc]/20 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#8a3ffc]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8a3ffc]/15 blur-3xl"></div>
      {/* Show warning banner if using mock data */}
      {apiError && (
        <div className="bg-amber-500/80 text-white py-2 px-4 text-center">
          <p className="text-sm font-medium">{apiError}</p>
        </div>
      )}

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
                  {data.linkedin_analysis && !data.linkedin_analysis.error
                    ? data.linkedin_analysis.full_name
                    : data.github_analysis.name}
                  {}'s Profile
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-[#d9d2e9]" />
                          <span className="text-sm font-medium text-[#d9d2e9]">LinkedIn</span>
                        </div>
                        <span className="text-sm font-medium text-[#d9d2e9]">
                          {data.linkedin_analysis && !data.linkedin_analysis.error
                            ? `${linkedinScore}/100`
                            : "Not connected"}
                        </span>
                      </div>
                      <Progress
                        value={data.linkedin_analysis && !data.linkedin_analysis.error ? linkedinScore : 0}
                        className="h-2 bg-[#d9d2e9]/10"
                      />
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
                  value="linkedin"
                  className="data-[state=active]:bg-[#8a3ffc] data-[state=active]:text-[#d9d2e9]"
                >
                  LinkedIn
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

                      {data.linkedin_analysis && !data.linkedin_analysis.error && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#d9d2e9]">Professional Profile</span>
                            <span className="text-sm font-medium text-[#d9d2e9]">
                              {linkedinScore >= 70
                                ? "Above Average"
                                : linkedinScore >= 40
                                  ? "Average"
                                  : "Below Average"}
                            </span>
                          </div>
                          <div className="relative h-4 w-full rounded-full bg-[#d9d2e9]/10">
                            <div
                              className="absolute h-full rounded-full bg-[#8a3ffc]"
                              style={{ width: `${linkedinScore}%` }}
                            />
                            <div className="absolute h-full w-[1px] left-[50%] bg-[#d9d2e9]/30" />
                            <div
                              className="absolute h-4 w-4 rounded-full bg-[#8a3ffc] border-2 border-[#1e0a3c] top-0 transform -translate-x-1/2"
                              style={{ left: `${linkedinScore}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-[#d9d2e9]/70">
                            <span>Below Average</span>
                            <span>Average</span>
                            <span>Above Average</span>
                          </div>
                        </div>
                      )}

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

              <TabsContent value="linkedin" className="space-y-4">
                {data.linkedin_analysis && !data.linkedin_analysis.error ? (
                  <>
                    <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-[#d9d2e9]">LinkedIn Profile</CardTitle>
                        <CardDescription className="text-[#d9d2e9]/70">
                          <a
                            href={data.linkedin_analysis.profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-[#8a3ffc] transition-colors"
                          >
                            {data.linkedin_analysis.full_name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            {data.linkedin_analysis.profile_pic && (
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#8a3ffc]/30">
                                  <img
                                    src={data.linkedin_analysis.profile_pic || "/placeholder.svg"}
                                    alt={data.linkedin_analysis.full_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-medium text-[#d9d2e9]">
                                {data.linkedin_analysis.headline || data.linkedin_analysis.occupation}
                              </h3>
                              <p className="text-sm text-[#d9d2e9]/80 mt-1">
                                {data.linkedin_analysis.location && (
                                  <span className="flex items-center gap-1 mb-1">
                                    <Users className="h-3.5 w-3.5 text-[#d9d2e9]/50" />
                                    {data.linkedin_analysis.location}
                                  </span>
                                )}
                              </p>
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-[#d9d2e9]/50" />
                                  <span className="text-sm text-[#d9d2e9]/80">
                                    {data.linkedin_analysis.connections || "500+"} connections
                                  </span>
                                </div>
                                {data.linkedin_analysis.followers > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-[#d9d2e9]/50" />
                                    <span className="text-sm text-[#d9d2e9]/80">
                                      {data.linkedin_analysis.followers} followers
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {data.linkedin_analysis.summary && (
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium text-[#d9d2e9]">About</h3>
                              <p className="text-sm text-[#d9d2e9]/80 whitespace-pre-line">
                                {data.linkedin_analysis.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Experience</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {data.linkedin_analysis.experiences && data.linkedin_analysis.experiences.length > 0 ? (
                            <div className="space-y-4">
                              {data.linkedin_analysis.experiences.slice(0, 4).map((exp, index) => (
                                <div key={index} className="border-l-2 border-[#8a3ffc]/30 pl-4 pb-2">
                                  <h3 className="text-base font-medium text-[#d9d2e9]">{exp.title}</h3>
                                  <p className="text-sm text-[#d9d2e9]/80">{exp.company}</p>
                                  <p className="text-xs text-[#d9d2e9]/60">
                                    {formatDate(exp.starts_at)} - {formatDate(exp.ends_at)}
                                  </p>
                                  {exp.location && <p className="text-xs text-[#d9d2e9]/60 mt-1">{exp.location}</p>}
                                  {exp.description && (
                                    <p className="text-xs text-[#d9d2e9]/70 mt-2 line-clamp-2">{exp.description}</p>
                                  )}
                                </div>
                              ))}
                              {data.linkedin_analysis.experiences.length > 4 && (
                                <p className="text-xs text-[#8a3ffc] text-center">
                                  + {data.linkedin_analysis.experiences.length - 4} more experiences
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Briefcase className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                              <p className="text-sm text-[#d9d2e9]/70">No experience listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Graduation className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Education</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {data.linkedin_analysis.education && data.linkedin_analysis.education.length > 0 ? (
                            <div className="space-y-4">
                              {data.linkedin_analysis.education.map((edu, index) => (
                                <div key={index} className="border-l-2 border-[#8a3ffc]/30 pl-4 pb-2">
                                  <h3 className="text-base font-medium text-[#d9d2e9]">{edu.school}</h3>
                                  <p className="text-sm text-[#d9d2e9]/80">
                                    {edu.degree_name}
                                    {edu.field_of_study ? `, ${edu.field_of_study}` : ""}
                                  </p>
                                  <p className="text-xs text-[#d9d2e9]/60">
                                    {formatDate(edu.starts_at)} - {formatDate(edu.ends_at)}
                                  </p>
                                  {edu.description && (
                                    <p className="text-xs text-[#d9d2e9]/70 mt-2 line-clamp-2">{edu.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Graduation className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                              <p className="text-sm text-[#d9d2e9]/70">No education listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Certificate className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Certifications</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {data.linkedin_analysis.certifications && data.linkedin_analysis.certifications.length > 0 ? (
                            <div className="space-y-4">
                              {data.linkedin_analysis.certifications.map((cert, index) => (
                                <div key={index} className="border-l-2 border-[#8a3ffc]/30 pl-4 pb-2">
                                  <h3 className="text-base font-medium text-[#d9d2e9]">{cert.name}</h3>
                                  <p className="text-sm text-[#d9d2e9]/80">{cert.authority}</p>
                                  {(cert.starts_at || cert.ends_at) && (
                                    <p className="text-xs text-[#d9d2e9]/60">
                                      {cert.starts_at ? formatDate(cert.starts_at) : ""}
                                      {cert.ends_at ? ` - ${formatDate(cert.ends_at)}` : ""}
                                    </p>
                                  )}
                                  {cert.url && (
                                    <a
                                      href={cert.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-[#8a3ffc] hover:text-[#a66eff] flex items-center gap-1 mt-1"
                                    >
                                      View Certificate <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Certificate className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                              <p className="text-sm text-[#d9d2e9]/70">No certifications listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Accomplishments</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {data.linkedin_analysis.accomplishments &&
                          data.linkedin_analysis.accomplishments.length > 0 ? (
                            <div className="space-y-2">
                              {data.linkedin_analysis.accomplishments.map((accomplishment, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className="mt-1 h-2 w-2 rounded-full bg-[#8a3ffc]" />
                                  <span className="text-sm text-[#d9d2e9]">{accomplishment}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Trophy className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                              <p className="text-sm text-[#d9d2e9]/70">No accomplishments listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Skills</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {data.linkedin_analysis.skills && data.linkedin_analysis.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {data.linkedin_analysis.skills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-sm bg-[#d9d2e9]/10 text-[#d9d2e9] hover:bg-[#d9d2e9]/20"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Code2 className="h-10 w-10 text-[#d9d2e9]/30 mb-2" />
                              <p className="text-sm text-[#d9d2e9]/70">No skills listed</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a3ffc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="relative z-10">
                          <div className="flex items-center gap-2">
                            <Languages className="h-5 w-5 text-[#8a3ffc]" />
                            <CardTitle className="text-[#d9d2e9]">Languages & Interests</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="space-y-4">
                            {data.linkedin_analysis.languages && data.linkedin_analysis.languages.length > 0 ? (
                              <div>
                                <h3 className="text-sm font-medium text-[#d9d2e9] mb-2">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                  {data.linkedin_analysis.languages.map((language, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
                                    >
                                      {language}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-sm text-[#d9d2e9]/70">No languages listed</p>
                              </div>
                            )}

                            {data.linkedin_analysis.interests && data.linkedin_analysis.interests.length > 0 ? (
                              <div>
                                <h3 className="text-sm font-medium text-[#d9d2e9] mb-2">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                  {data.linkedin_analysis.interests.map((interest, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-[#d9d2e9]/5 text-[#d9d2e9]/80 border-[#d9d2e9]/20"
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-sm text-[#d9d2e9]/70">No interests listed</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-[#d9d2e9]/10 bg-white/5 backdrop-blur-sm rounded-lg">
                    <Linkedin className="h-16 w-16 text-[#d9d2e9]/30 mb-4" />
                    <h2 className="text-xl font-bold text-[#d9d2e9] mb-2">LinkedIn Profile Not Connected</h2>
                    <p className="text-center text-[#d9d2e9]/70 max-w-md mb-6">
                      Connect your LinkedIn profile to get a comprehensive analysis of your professional experience,
                      skills, and network.
                    </p>
                    <Button className="bg-[#8a3ffc] hover:bg-[#7b38e3] text-white">Connect LinkedIn Profile</Button>
                  </div>
                )}
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
