import os
import time
import re
from flask import Flask, jsonify, request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

def extract_numbers(text):
    """Extract the first number found in a given text"""
    numbers = re.findall(r'\d+', text)
    return numbers[0] if numbers else "0"

def scrape_linkedin_posts(profile_url):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.get("https://www.linkedin.com/login")
        time.sleep(3)

        username = driver.find_element(By.ID, "username")
        password = driver.find_element(By.ID, "password")

        username.send_keys(os.getenv("LINKEDIN_EMAIL"))
        password.send_keys(os.getenv("LINKEDIN_PASSWORD"))
        password.send_keys(Keys.RETURN)
        time.sleep(5)

        # Navigate to profile URL
        driver.get(profile_url)
        time.sleep(5)

        # Scroll multiple times to load more posts
        for _ in range(10):  
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)

        # Extract posts
        posts = driver.find_elements(By.CLASS_NAME, "update-components-text")  
        post_data = []

        for post in posts:
            try:
                description = post.text.strip() if post.text else "No description"

                # Extract post link
                try:
                    post_link = post.find_element(By.XPATH, ".//a[contains(@href, '/posts/')]").get_attribute("href")
                except:
                    post_link = "N/A"

                # Extract timestamp
                try:
                    timestamp = post.find_element(By.XPATH, ".//span[contains(@class, 'feed-shared-actor__sub-description')]").text
                except:
                    timestamp = "Unknown"

                # Extract author name
                try:
                    author = post.find_element(By.XPATH, ".//span[contains(@class, 'feed-shared-actor__name')]").text
                except:
                    author = "Unknown"

                # Extract reactions
                try:
                    reactions_element = post.find_elements(By.XPATH, ".//span[@aria-label]")
                    reactions = {reaction.text.split()[1]: extract_numbers(reaction.text) for reaction in reactions_element if reaction.text} if reactions_element else {}
                except:
                    reactions = {}

                post_data.append({
                    "author": author,
                    "description": description,
                    "timestamp": timestamp,
                    "post_link": post_link,
                    "reactions": reactions
                })
            except Exception as e:
                print(f"Error fetching post data: {e}")

        driver.quit()
        return {"profile_url": profile_url, "posts": post_data}

    except Exception as e:
        driver.quit()
        return {"error": str(e)}

@app.route('/')
def home():
    return "Welcome to the LinkedIn Profile Scraper API! Use /linkedin_profile?url=<PROFILE_URL> to fetch posts."

@app.route('/linkedin_profile', methods=['GET'])
def linkedin_profile():
    profile_url = request.args.get('url')

    if not profile_url:
        return jsonify({"error": "Please provide a LinkedIn profile URL using ?url=<PROFILE_URL>"}), 400

    data = scrape_linkedin_posts(profile_url)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
