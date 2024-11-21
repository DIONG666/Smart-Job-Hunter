import json
import os

from zhipuai import ZhipuAI
client = ZhipuAI(api_key="9a39f8fd6b3776ef950aeb2421a393b8.ed2wnpLn0VGh3YUX") # 填写您自己的APIKey

def calculate_skills_match_percentage(resume_skills, work_keywords):
    # 将简历技能字符串分割为列表，并去除空格
    resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]

    # 计算交集和并集
    skills_intersection = set(resume_skills_list).intersection(set(work_keywords))
    # 计算契合度百分比
    match_percentage = len(skills_intersection) / len(work_keywords) * 100

    return match_percentage
def identify_skill_gaps(resume_skills, work_keywords):
    resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]
    resume_skills_set = set(resume_skills_list)
    work_keywords_set = set(work_keywords)

    # 找出简历中缺失的关键技能
    missing_skills = work_keywords_set - resume_skills_set
    return list(missing_skills)
def get_improvement_suggestions(skill_gaps):
    client = ZhipuAI(api_key="9a39f8fd6b3776ef950aeb2421a393b8.ed2wnpLn0VGh3YUX")
    messages = [
        {"role": "system", "content": "你是一名职业发展顾问,善于给出建设性的职业发展建议。"},
        {"role": "user", "content": f"我是一名求职者,以下是我与目标岗位的技能差距:{', '.join(skill_gaps)}。请给出我一些提升建议。"}
    ]
    response = client.chat.completions.create(
        model="glm-4",
        messages=messages,
        stream=True
    )
    for chunk in response:
        print(chunk.choices[0].delta.content)
    # suggestions = response.choices[0].message.content
    suggestions=""
    return suggestions

def access(work_id,resume_path,all_info_path):
    with open(resume_path, 'r', encoding='utf-8') as file:
        data = json.load(file)  # 直接从文件中读取并解析JSON数据
    resume_skills = data['skills']
    with open(all_info_path, 'r', encoding='utf-8') as f:
        work_data = json.load(f)
    work_info = {work['id']: work for work in work_data}
    for id, work in work_info.items():
        id = int(work['id'])
        if work_id!=id :
            continue
        work_keywords = work_info[work_id]['skills']
        break
    missing_skills= identify_skill_gaps(resume_skills, work_keywords)
    print(missing_skills)
    suggestions = get_improvement_suggestions(missing_skills)
    return suggestions

work_id = 4601
resume_path='resume.json'
all_info_path = 'all_info.json'
suggestions=access(work_id, resume_path, all_info_path)
print(suggestions)


