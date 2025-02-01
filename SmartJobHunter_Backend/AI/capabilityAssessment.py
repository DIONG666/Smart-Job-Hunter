import json
import os

from zhipuai import ZhipuAI

client = ZhipuAI(api_key="f2065e033cc5c35ddb6ceadc439756c6.mJmEtnZPVPO8mzoT")  # 填写您自己的APIKey


def calculate_skills_match_percentage(resume_skills, work_keywords):
    # 将简历技能字符串分割为列表，并去除空格
    resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]

    # 计算交集和并集
    skills_intersection = set(resume_skills_list).intersection(set(work_keywords))
    # 计算契合度百分比
    match_percentage = len(skills_intersection) / len(work_keywords) * 100

    return match_percentage


def identify_skill_gaps(resume_skills, work_keywords):
    # resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]
    resume_skills_set = set(resume_skills)
    work_keywords_set = set(work_keywords)

    # 找出简历中缺失的关键技能
    missing_skills = work_keywords_set - resume_skills_set
    return list(missing_skills)


def get_improvement_suggestions(skill_gaps):
    client = ZhipuAI(api_key="f2065e033cc5c35ddb6ceadc439756c6.mJmEtnZPVPO8mzoT")
    messages = [
        {"role": "system", "content": "你是一名职业发展顾问,善于给出建设性的职业发展建议。"},
        {"role": "user",
         "content": f"我是一名应届生求职者,以下是我与目标岗位的技能差距:{', '.join(skill_gaps)}。请给出我一些提升建议。你应该以“当前你与目标岗位的差距在于：”开头"}
    ]
    response = client.chat.completions.create(
        model="glm-4",
        messages=messages,
        stream=True
    )
    suggestions = ""
    for chunk in response:
        # print(chunk.choices[0].delta.content)
        suggestions += chunk.choices[0].delta.content
    return suggestions


def access(user_id, work_id, resume_path, all_info_path):
    # 加载简历数据
    with open(resume_path, 'r', encoding='utf-8') as file:
        datas = json.load(file)  # 直接从文件中读取并解析JSON数据
    student_info = {student['user_id']: student for student in datas}
    data = student_info.get(user_id, {})
    resume_skills = data['skills']
    # 加载所有工作信息
    with open(all_info_path, 'r', encoding='utf-8') as f:
        work_data = json.load(f)
    work_info = {work['id']: work for work in work_data}
    work_info_item = work_info.get(work_id, {})
    work_keywords = work_info_item.get('skills', [])
    missing_skills = identify_skill_gaps(resume_skills, work_keywords)
    # print(missing_skills)
    suggestions = get_improvement_suggestions(missing_skills)
    return suggestions


# work_id = 4601
# resume_path = 'resume.json'
# all_info_path = 'all_info.json'
# suggestions = access(work_id, resume_path, all_info_path)
# print(suggestions)
