import json
import os
from openai import OpenAI  # 修改导入库

# 初始化DeepSeek客户端（请自行填写API key）
client = OpenAI(
    api_key="sk-d5909142d7994378be059ca4c85efd81",  # 请在此处填写您的DeepSeek API Key
    base_url="https://api.deepseek.com/v1"
)


def calculate_skills_match_percentage(resume_skills, work_keywords):
    resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]
    skills_intersection = set(resume_skills_list).intersection(set(work_keywords))
    match_percentage = len(skills_intersection) / len(work_keywords) * 100
    return match_percentage


def identify_skill_gaps(resume_skills, work_keywords):
    resume_skills_set = set(resume_skills)
    work_keywords_set = set(work_keywords)
    missing_skills = work_keywords_set - resume_skills_set
    return list(missing_skills)


def get_improvement_suggestions(skill_gaps):
    messages = [
        {"role": "system", "content": "你是一名职业发展顾问，善于给出建设性的职业发展建议。"},
        {"role": "user",
         "content": f"我是一名应届生求职者，以下是我与目标岗位的技能差距：{', '.join(skill_gaps)}。请给出我一些提升建议。你应该以“当前你与目标岗位的差距在于：”开头"}
    ]

    response = client.chat.completions.create(
        model="deepseek-chat",  # 使用DeepSeek的模型
        messages=messages,
        stream=True
    )

    suggestions = ""
    for chunk in response:
        if chunk.choices[0].delta.content:
            suggestions += chunk.choices[0].delta.content
    return suggestions


def access(user_id, work_id, resume_path, all_info_path):
    with open(resume_path, 'r', encoding='utf-8') as file:
        datas = json.load(file)
    student_info = {student['user_id']: student for student in datas}
    data = student_info.get(user_id, {})
    resume_skills = data['skills']

    with open(all_info_path, 'r', encoding='utf-8') as f:
        work_data = json.load(f)
    work_info = {work['id']: work for work in work_data}
    work_info_item = work_info.get(work_id, {})
    work_keywords = work_info_item.get('skills', [])

    missing_skills = identify_skill_gaps(resume_skills, work_keywords)
    suggestions = get_improvement_suggestions(missing_skills)
    return suggestions

# 使用示例（需要先填写API key）
# work_id = 4601
# user_id = "your_user_id"
# resume_path = 'resume.json'
# all_info_path = 'all_info.json'
# suggestions = access(user_id, work_id, resume_path, all_info_path)
# print(suggestions)