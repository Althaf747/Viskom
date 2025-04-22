import json
import csv
import os

# Load quiz data from external JSON file
json_path = "quiz2.json"  # Ensure this path is correct
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Define the path where you want to save the CSV
local_path = r"C:\Users\altha\Downloads\quiz-app\quiz2_questions.csv"

# Ensure the directory exists
os.makedirs(os.path.dirname(local_path), exist_ok=True)

# Determine the maximum number of options for consistent columns
max_options = max(len(item["options"]) for item in data)

# Create the CSV file
with open(local_path, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    # Write dynamic header
    header = ["Question"] + [f"Option {i+1}" for i in range(max_options)] + ["Answer"]
    writer.writerow(header)

    # Write question rows
    for item in data:
        question = item["question"]
        options = item["options"]
        answer = item["answer"]

        # Pad options if there are fewer than the max
        options += [""] * (max_options - len(options))

        writer.writerow([question] + options + [answer])

print(f"CSV file has been created at {local_path}")
