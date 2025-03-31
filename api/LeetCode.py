import requests

def fetch_leetcode_data(username):
    url = "https://leetcode.com/graphql"
    query = f"""
    {{
        matchedUser(username: "{username}") {{
            username
            profile {{
                ranking
                reputation
            }}
            submitStats {{
                totalSubmissionNum {{
                    difficulty
                    count
                }}
            }}
            languageProblemCount {{
                languageName
                problemsSolved
            }}
            tagProblemCounts {{
                advanced {{
                    tagName
                    problemsSolved
                }}
                intermediate {{
                    tagName
                    problemsSolved
                }}
                fundamental {{
                    tagName
                    problemsSolved
                }}
            }}
        }}
    }}
    """
    
    response = requests.post(url, json={"query": query})
    data = response.json()

    if "errors" in data:
        print("❌ Error fetching data:", data["errors"])
        return

    user_data = data.get("data", {}).get("matchedUser", {})

    print("\n🔹 *LeetCode Profile Overview* 🔹")
    print(f"👤 *Username:* {user_data.get('username', 'N/A')}")
    print(f"🏆 *Ranking:* {user_data.get('profile', {}).get('ranking', 'N/A')}")
    print(f"⭐ *Reputation:* {user_data.get('profile', {}).get('reputation', 'N/A')}\n")

    print("📊 *Solutions Submitted:*")
    for submission in user_data.get("submitStats", {}).get("totalSubmissionNum", []):
        print(f"   - {submission['difficulty']} problems solved: {submission['count']}")

    print("\n💻 *Languages Used:*")
    for lang in user_data.get("languageProblemCount", []):
        print(f"   - {lang['languageName']}: {lang['problemsSolved']} problems solved")

    print("\n📚 *Skills Demonstrated:*")

    def print_skills(level, skills):
        print(f"   🔹 {level.capitalize()} Skills:")
        for skill in skills:
            print(f"      - {skill['tagName']}: {skill['problemsSolved']} problems solved")

    skills = user_data.get("tagProblemCounts", {})
    print_skills("Advanced", skills.get("advanced", []))
    print_skills("Intermediate", skills.get("intermediate", []))
    print_skills("Fundamental", skills.get("fundamental", []))

# 🔥 Run the script with the desired username
fetch_leetcode_data("Meet__Paladiya") 