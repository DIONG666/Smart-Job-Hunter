import pandas as pd
import numpy as np
import json
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(user_agent="city_distance_calculator")
preferred_cities = ["杭州", "厦门", "北京", "上海", "天津", "西安", "长沙",
                    "成都", "广州", "苏州", "郑州", "深圳", "武汉", "重庆"]
# 得到城市的经纬度
def get_coordinates(city):
    location = geolocator.geocode(city, language="zh",timeout=7)
    if location:
        return (location.latitude, location.longitude)
    else:
        print(f"找不到城市 '{city}' 的经纬度信息")
        return None
def parse_salary(salary_str):
    """解析薪资字符串，返回薪资范围的最小值和最大值"""
    # 将字符串转换为小写以统一处理大写和小写的'K'
    parts = salary_str.lower().replace('k', '000').split('-')
    if len(parts) == 2:
        min_salary, max_salary = int(parts[0].strip()), int(parts[1].strip())
    else:
        min_salary = max_salary = int(parts[0].strip())
    return min_salary, max_salary
#归一化总得分
def normalize_scores(scores):
    scores_array = np.array(list(scores.values()))
    mean_score = np.mean(scores_array)
    std_score = np.std(scores_array)
    normalized_scores = {work_id: 1 / (1 + np.exp(-(score - mean_score) / std_score)) for work_id, score in scores.items()}
    return normalized_scores
def calculate_skills_match_percentage(resume_skills, work_keywords):
    # 将简历技能字符串分割为列表，并去除空格
    resume_skills_list = [skill.strip() for skill in resume_skills.split(',')]

    # 计算交集和并集
    skills_intersection = set(resume_skills_list).intersection(set(work_keywords))
    skills_union = set(resume_skills_list).union(set(work_keywords))

    # 计算契合度百分比
    match_percentage = len(skills_intersection) / len(skills_union)

    return match_percentage
def calculate_salary_match_percentage(dream_salary_str, work_salary_str):
    if work_salary_str == "Unknown":
        return 0.02  # 将2%表示为0.02，以保持返回值的一致性
    """根据新规则计算薪资匹配度"""
    dream_salary = parse_salary(dream_salary_str)[0]  # 解析期望薪资
    _, max_work_salary = parse_salary(work_salary_str)  # 解析工作薪资范围的最大值
    if dream_salary <= max_work_salary:
        # 期望薪资小于等于工作薪资范围的最大值
        match_percentage = 1
    else:
        # 期望薪资大于工作薪资范围的最大值
        # 引入平滑因子，减少匹配度下降的速度
        smooth_factor = 0.5  # 平滑因子可以根据实际需要调整
        difference_ratio = (dream_salary - max_work_salary) / max_work_salary
        match_percentage = 1 - (difference_ratio * smooth_factor)
        match_percentage = max(0.01, match_percentage)  # 使用0.01作为最低匹配度，避免出现0%

    return match_percentage
def calculate_location_match_percentage(resume_city, work_city):
    if work_city== "Unknown":
        return 2
    """计算地点的偏好匹配度"""
    # 基于城市偏好名单计算匹配度
    if (resume_city in preferred_cities) == (work_city in preferred_cities):
        preference_1 = 1
    else:
        preference_1 = 0
    # 获取工作城市和居住城市的经纬度
    work_coordinates = get_coordinates(work_city)
    resume_coordinates = get_coordinates(resume_city)
    if work_coordinates and resume_coordinates:
        # 计算城市之间的地理距离
        distance_km = geodesic(work_coordinates, resume_coordinates).kilometers

        # 将距离转换为评分（距离越近，评分越高）
        # 这里采用一个简单的线性转换
        max_distance_km = 5000  # 假设最大距离为5000公里
        min_score = 0  # 最低评分
        max_score = 1  # 最高评分

        # 线性转换
        score2 = max_score - (distance_km / max_distance_km) * (max_score - min_score)
        score2 = max(min_score, min(score2, max_score))  # 确保评分在合理范围内
    score=0.5*preference_1+0.5*score2
    return score
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

    # 如果简历学历等于或高于工作学历，则契合度为100%
    if resume_level >= work_level:
        return 1

    # 如果简历学历低于工作学历，则根据差距进行计算
    else:
        # 定义学历差距对契合度的影响，这里简单地以差一个学历级别减少50%契合度为例
        # 注意：这个衰减因子可以根据实际需求调整
        decay_factor = 50
        gap = work_level - resume_level
        match_percentage = max(0, 100 - gap * decay_factor)

        return match_percentage/100

def recommend_resumes(resumes_embedding_path, resumes_data_path, work_id, all_info_path, work_embeddings_path, top_n=30):
    # 加载简历数据
    with open(resumes_data_path, 'r', encoding='utf-8') as file:
        resumes_list = json.load(file)
    # 将简历列表转换为字典，以ID为键
    resumes_data = {resume['id']: resume for resume in resumes_list}

    # 加载所有简历的向量
    resumes_embeddings_df = pd.read_csv(resumes_embedding_path, header=None)
    resumes_embeddings = {row[0]: np.array([float(x) for x in row[1:].values]) for index, row in resumes_embeddings_df.iterrows()}

    with open(resumes_data_path, 'r', encoding='utf-8') as file:
        resumes_datas = json.load(file)
    datas = {data['id']: data for data in resumes_datas}

    with open(all_info_path, 'r', encoding='utf-8') as f:
        work_data = json.load(f)
    work_info = {work['Identity']: work for work in work_data}
    work_info_item = work_info.get(str(work_id), {})
    work_keywords = work_info_item.get('Keywords', [])
    work_salary = work_info_item.get('Salary_Range', "Unknown")
    work_address = work_info_item.get('City', "Unknown")
    work_education = work_info_item.get('Education_Requirement', "Unknown")
    print(work_salary)
    # 加载特定工作的向量
    work_embeddings_df = pd.read_csv(work_embeddings_path, header=None)
    work_embeddings = {row[0]: np.array([float(x) for x in row[1:].values]) for index, row in work_embeddings_df.iterrows()}
    work_embedding = work_embeddings[work_id]

    scores={}
    skills_scores={}
    for candidate_id,resume_embedding in resumes_embeddings.items():

        score = np.dot(resume_embedding, work_embedding)
        scores[candidate_id] = score

        data = datas.get(candidate_id, {})
        resume_skills=data['skills']
        skills_scores[candidate_id] = calculate_skills_match_percentage(resume_skills,work_keywords)

    # 使用normalize_scores函数归一化评分
    normalized_scores = normalize_scores(scores)

    # 对归一化后的评分进行排序，选择得分最高的简历
    sorted_normalized_scores = sorted(skills_scores.items(), key=lambda item: item[1], reverse=True)[:top_n]




    # 输出推荐的简历ID和得分
    for resume_id, score in sorted_normalized_scores:
        data=datas.get(resume_id, {})
        resume_city = data['city']
        resume_skills = data['skills']
        dream_salary = data['salary']
        resume_education = data['education']

        skill_percentage = calculate_skills_match_percentage(resume_skills, work_keywords)
        salary_percentage = calculate_salary_match_percentage(dream_salary, work_salary)
        city_percentage = calculate_location_match_percentage(resume_city, work_address)
        education_percentage = calculate_education_match_percentage(resume_education, work_education)
        normalized_score = normalized_scores[resume_id]
        resume_info = resumes_data.get(resume_id)  # 使用get方法安全地访问字典
        print(f"简历ID: {resume_id},技能契合度：{skill_percentage:.3f},薪资契合度：{salary_percentage:.3f}"
              f",城市契合度：{city_percentage:.3f},学历契合度：{education_percentage:.3f} ,得分: {normalized_score:.3f}, 信息: {resume_info}")

# 示例调用
resumes_embedding_path = 'resumes_embedding.csv'
resumes_data_path = 'resumes.json'
work_id = 123  # 假设的特定工作ID
all_info_path = 'all_info.json'
work_embeddings_path = 'work_embeddings.csv'
recommend_resumes(resumes_embedding_path, resumes_data_path, work_id, all_info_path, work_embeddings_path, top_n=30)
