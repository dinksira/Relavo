import requests
try:
    print("Testing connection to google...")
    res = requests.get("https://google.com", timeout=5)
    print("Connected! Status:", res.status_code)
except Exception as e:
    print(f"FAILED TO REACH INTERNET: {e}")
