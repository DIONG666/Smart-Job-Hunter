import pandas as pd
import numpy as np
import random
import json
import re
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(user_agent="city_distance_calculator")
preferred_cities = ["杭州", "厦门", "北京", "上海", "天津", "西安", "长沙",
                    "成都", "广州", "苏州", "郑州", "深圳", "武汉", "重庆"]


# 得到城市的经纬度
def get_coordinates_cached(city, city_coordinates_cache):
    if city not in city_coordinates_cache:
        location = geolocator.geocode(city, language="zh", timeout=7)
        if location:
            city_coordinates_cache[city] = (location.latitude, location.longitude)
        else:
            print(f"找不到城市 '{city}' 的经纬度信息")
            city_coordinates_cache[city] = None
    return city_coordinates_cache[city]


def parse_salary(salary_str):
    """解析薪资字符串，返回薪资范围的最小值和最大值。"""
    # 移除最后一个'K'之后的所有内容
    salary_str = re.sub(r'k[^k]*$', 'k', salary_str, flags=re.IGNORECASE)

    # 将字符串转换为小写以统一处理大写和小写的'K'
    parts = salary_str.lower().replace('k', '').split('-')

    if len(parts) == 2:

        # 使用正则表达式提取字符串中的数字部分
        min_salary_numbers = re.findall(r'\d+', parts[0].strip())
        max_salary_numbers = re.findall(r'\d+', parts[1].strip())
        # 确保提取到的是数字并进行转换
        if min_salary_numbers:
            min_salary = int(''.join(min_salary_numbers)) *1000  # 正确处理最小薪资
        else:
            min_salary = 1
        if max_salary_numbers:
            max_salary = int(''.join(max_salary_numbers)) *1000   # 正确处理最大薪资
        else:
            max_salary = 1
    else:
        # 对于单一值的情况，只需提取一次数字

        salary_numbers = re.findall(r'\d+', parts[0].strip())
        if salary_numbers:
            min_salary = max_salary = int(''.join(salary_numbers))*1000
        else:
            min_salary = max_salary = 1
    return min_salary, max_salary


# 归一化总得分
def normalize_scores(scores):
    scores_array = np.array(list(scores.values()))
    mean_score = np.mean(scores_array)
    std_score = np.std(scores_array)
    normalized_scores = {work_id: 1 / (1 + np.exp(-(score - mean_score) / std_score)) for work_id, score in
                         scores.items()}
    return normalized_scores


def calculate_skills_match_percentage(resume_skills, work_keywords):
    # 将简历技能字符串分割为列表，并去除空格
    # resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]

    # 计算交集和并集
    skills_intersection = set(resume_skills).intersection(set(work_keywords))
    skills_required = set(work_keywords)

    # 计算契合度百分比
    if len(skills_required) <= 2:
        return 0

    match_percentage = len(skills_intersection) + 1 / len(skills_required)
    match_percentage = max(0, min(1, match_percentage))
    match_percentage += random.uniform(-0.1, -0.05)
    return match_percentage



def calculate_salary_match_percentage(min_dream_salary, max_dream_salary, work_salary_str):
    if work_salary_str == "Unknown":
        return 0.02  # 将2%表示为0.02，以保持返回值的一致性

    min_work_salary, max_work_salary = parse_salary(work_salary_str)

    # 完全匹配的情况
    if max_dream_salary <= max_work_salary and min_dream_salary >= min_work_salary:
        return 1
    elif max_work_salary < min_dream_salary:
        # 期望薪资范围完全高于岗位薪资范围
        average_dream_salary = (min_dream_salary + max_dream_salary) / 2
        average_work_salary = (min_work_salary + max_work_salary) / 2
        difference_ratio = (average_dream_salary - average_work_salary) / average_dream_salary
    elif max_dream_salary < min_work_salary:
        # 岗位薪资范围完全高于期望薪资范围
        average_dream_salary = (min_dream_salary + max_dream_salary) / 2
        average_work_salary = (min_work_salary + max_work_salary) / 2
        difference_ratio = (average_work_salary - average_dream_salary) / average_work_salary
    else:
        # 有交集的情况，但不是完全匹配
        intersection = min(max_dream_salary, max_work_salary) - max(min_dream_salary, min_work_salary)
        total_range = max(max_dream_salary, max_work_salary) - min(min_dream_salary, min_work_salary)
        match_percentage = intersection / total_range
        return match_percentage

    # 使用平滑因子来调整匹配度
    smooth_factor = 0.8
    match_percentage = 1 - (difference_ratio * smooth_factor)
    match_percentage = max(0.01, match_percentage)  # 使用0.01作为最低匹配度

    return match_percentage



def location_match_percentage(resume_city, work_city, city_coordinates_cache):
    if work_city == "Unknown":
        return 2
    """计算地点的偏好匹配度"""
    # 基于城市偏好名单计算匹配度
    if (resume_city in preferred_cities) == (work_city in preferred_cities):
        preference_1 = 1
    else:
        preference_1 = 0
    # 获取工作城市和居住城市的经纬度
    work_coordinates = get_coordinates_cached(work_city, city_coordinates_cache)
    resume_coordinates = get_coordinates_cached(resume_city, city_coordinates_cache)
    if work_coordinates and resume_coordinates:
        print(f"工作坐标: {work_coordinates}, 简历坐标: {resume_coordinates}")
    else:
        print(f"缺少坐标信息: 工作城市 '{work_city}', 简历城市 '{resume_city}'")
    if work_coordinates and resume_coordinates:
        # 计算城市之间的地理距离
        distance_km = geodesic(work_coordinates, resume_coordinates).kilometers

        # 使用1/x曲线调整距离评分，其中x为距离
    # 设定一个最小距离值，避免除数为0
    min_distance_km = 1
    distance_km = max(distance_km, min_distance_km)  # 确保距离不小于最小距离
    # 评分转换，这里1/（1+距离）用于保持评分在合理范围内
    score2 = 1 / (1 + distance_km / 1500)  # 使用1000作为调节因子，调整距离对评分的影响
    score = 0.5 * preference_1 + 0.5 * score2
    return score


def calculate_location_match_percentage(resume_city, work_city):
    if work_city == "Unknown":
        return 2
    """计算地点的偏好匹配度"""
    # 基于城市偏好名单计算匹配度
    if (resume_city in preferred_cities) == (work_city in preferred_cities):
        preference_1 = 1
    else:
        preference_1 = 0
    # 获取工作城市和居住城市的经纬度
    # work_coordinates = get_coordinates(work_city)
    # resume_coordinates = get_coordinates(resume_city)
    # if work_coordinates and resume_coordinates:
    #     # 计算城市之间的地理距离
    #     distance_km = geodesic(work_coordinates, resume_coordinates).kilometers
    #
    #     # 将距离转换为评分（距离越近，评分越高）
    #     # 这里采用一个简单的线性转换
    #     max_distance_km = 5000  # 假设最大距离为5000公里
    #     min_score = 0  # 最低评分
    #     max_score = 1  # 最高评分
    #
    #     # 线性转换
    #     score2 = max_score - (distance_km / max_distance_km) * (max_score - min_score)
    #     score2 = max(min_score, min(score2, max_score))  # 确保评分在合理范围内
    # score=0.5*preference_1+0.5*score2
    return preference_1


def calculate_education_match_percentage(resume_education, work_education):
    # 定义学历与数值权重的映射
    education_levels = {
        "大专": 1,
        "本科": 2,
        "硕士": 3,
        "博士": 4
    }

    # 获取简历和工作学历的数值权重
    resume_level = education_levels.get(resume_education, 0)
    work_level = education_levels.get(work_education, 0)

    # 如果简历学历低于工作学历要求
    if resume_level < work_level:
        return 0

    # 如果简历学历等于工作学历要求
    elif resume_level == work_level:
        return 1

    # 如果简历学历高于工作学历要求
    else:
        # 定义平滑减分的衰减系数，例如超出的每一级减少5%的契合度
        smooth_decay_factor = 0.3
        # 根据超出的教育水平计算契合度
        match_percentage = 1 - smooth_decay_factor * (resume_level - work_level)
        # 确保匹配度不会低于某个阈值，例如0.2
        return match_percentage



def recommend_resumes(resumes_data_path, work_id, all_info_path, city_location_path):
    # 加载简历数据

    with open(resumes_data_path, 'r', encoding='utf-8') as file:
        resumes_datas = json.load(file)
    datas = {data['id']: data for data in resumes_datas}

    # load the information of the job.
    with open(all_info_path, 'r', encoding='utf-8') as f:
        work_data = json.load(f)
    work_info = {work['user_id']: work for work in work_data}
    work_info_item = work_info.get(work_id, {})
    work_keywords = work_info_item.get('skills', [])
    work_salary = work_info_item.get('salary', "Unknown")
    work_address = work_info_item.get('city', "Unknown")
    work_education = work_info_item.get('education', "Unknown")

    # 从JSON文件中读取城市与坐标的映射信息
    with open(city_location_path, 'r') as f:
        city_coordinates_cache = json.load(f)

    scores = {}
    skill_scores = {}
    edu_scores = {}
    salary_scores = {}
    city_scores = {}
    # 输出推荐的简历ID和得分
    for resume_id, data in datas.items():
        resume_city = data['intentionCity']
        resume_skills = data['skills']
        dream_salary_low = int(data['lowestSalary'])
        dream_salary_high = int(data['highestSalary'])
        resume_education = data['education']
        edu_scores[resume_id] = calculate_education_match_percentage(resume_education, work_education)
        skill_scores[resume_id] = calculate_skills_match_percentage(resume_skills, work_keywords)
        salary_scores[resume_id] = calculate_salary_match_percentage(dream_salary_low, dream_salary_high, work_salary)
        city_scores[resume_id] = location_match_percentage(resume_city, work_address, city_coordinates_cache)
        scores[resume_id] = 0.4 * skill_scores[resume_id] + 0.2 * edu_scores[resume_id] + 0.2 * salary_scores[
            resume_id] + 0.2 * city_scores[resume_id]
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    all_scores = []
    for resume_id in sorted_scores:
        all_scores.append({
            "resume_id": resume_id,
            "weighted_score": round(scores[resume_id[0]]*100, 1),
            "skill_score": round(skill_scores[resume_id[0]], 2),
            "education_score": round(edu_scores[resume_id[0]], 2),
            "salary_score": round(salary_scores[resume_id[0]], 2),
            "city_score": round(city_scores[resume_id[0]], 2)
        })

    return all_scores

# 示例调用
# resumes_data_path = './Identity_and_Infomation/resumes.json'
# work_id = 63  # 假设的特定工作ID
# all_info_path = './Identity_and_Infomation/all_info.json'
# city_location_path= './Identity_and_Infomation/city_coordinates_cache.json'
# recommend_resumes(resumes_data_path, work_id, all_info_path,city_location_path)
