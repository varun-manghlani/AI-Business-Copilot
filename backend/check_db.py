import sqlite3
import os

print("Check DB:", os.path.abspath("business_copilot.db"))

connection = sqlite3.connect("business_copilot.db")

cursor = connection.cursor()

cursor.execute("SELECT * FROM messages")

messages = cursor.fetchall()

print(messages)

connection.close()