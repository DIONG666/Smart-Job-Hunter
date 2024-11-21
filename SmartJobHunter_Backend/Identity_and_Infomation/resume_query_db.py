import sqlite3
import json

conn = sqlite3.connect('resumes.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM resumes;")
rows = cursor.fetchall()

resumes_list = []
for row in rows:
    resume_dict = {
        'id': row[0],
        'name': row[1],
        'age': row[2],
        'phone': row[3],
        'email': row[4],
        'intention': row[5],
        'skills': row[6],
        'major': row[7],
        'city': row[8],
        'education': row[9]
    }
    resumes_list.append(resume_dict)

json_data = json.dumps(resumes_list, ensure_ascii=False, indent=4)

# 写入JSON数据到文件
with open('resumes.json', 'w',encoding='utf-8') as file:
    file.write(json_data)

conn.close()
