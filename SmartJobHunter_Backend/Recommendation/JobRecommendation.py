import json

from flask import Flask, request, jsonify, Blueprint
from datetime import datetime, timedelta
import sqlite3
from competAssess.CapabilityAssessment import access
import time

jobs = Blueprint('jobs', __name__)

DATABASE = 'Information.db'


def calculate_last_active(created_at):
    today = datetime.now().date()
    delta = today - created_at
    if delta.days == 0:
        return "刚刚"
    elif delta.days <= 7:
        return f"{delta.days}天之内活跃"
    elif delta.days <= 28:
        weeks = delta.days // 7
        return f"{weeks}周之内活跃"
    else:
        months = delta.days // 30  # 简化计算，假设每个月30天
        return f"{months}月之内活跃"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # 方便后面将行数据转化为字典
    return conn


@jobs.route('/jobs/recommended/<int:user_id>', methods=['GET'])
def get_recommended_jobs(user_id):
    time.sleep(1.5)
    conn = get_db_connection()
    cursor = conn.cursor()

    # 查询推荐职位ID和匹配度
    cursor.execute('''
           SELECT ci.id, ci.name, ci.job, ci.description, ci.education, ci.manager, ci.salary, ci.address, ci.link, ci.city, ci.skills, ci.lastActive,
                  rj.match, rj.educationMatch, rj.addressMatch, rj.salaryMatch, rj.abilityMatch
           FROM recommended_jobs rj
           JOIN company_info ci ON rj.job_id = ci.id
           WHERE rj.user_id = ?
           ORDER BY rj.match DESC
           LIMIT 20
       ''', (user_id,))
    jobs = cursor.fetchall()
    # print(jobs)
    if not jobs:
        return jsonify({'message': '未找到推荐职位'}), 404

    # 获取列名
    columns = [column[0] for column in cursor.description]
    jobs_list = []
    for job in jobs:
        job_dict = dict(zip(columns, job))
        # 转换skills字符串为列表
        # print(job_dict['skills'])
        jobs_list.append(job_dict)

    conn.close()

    return jsonify(jobs_list), 200


@jobs.route('/jobs/evaluation/<int:user_id>/<int:job_id>', methods=['GET'])
def ability_evaluation(user_id, job_id):
    resume_path = 'resumes.json'
    all_info_path = 'all_info.json'
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
            SELECT evaluation FROM recommended_jobs 
            WHERE user_id = ? AND job_id = ?
        ''', (user_id, job_id))
    result = cursor.fetchone()

    if result and result['evaluation'] is not None:
        # 如果存在evaluation数据，直接使用这个数据
        evaluation = result['evaluation']
    else:
        # 如果不存在，调用access函数获取evaluation，并更新或插入到数据库中
        evaluation = access(user_id, job_id, resume_path, all_info_path)
        cursor.execute('''
                UPDATE recommended_jobs SET evaluation = ?
                WHERE user_id = ? AND job_id = ?
            ''', (evaluation, user_id, job_id))

    conn.commit()
    conn.close()

    return jsonify(evaluation), 200


@jobs.route('/jobs/sort/<int:user_id>/<criteria>', methods=['GET'])
def sort_jobs(user_id, criteria):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 定义排序字段映射
    sort_fields = {
        'education': 'educationMatch',
        'location': 'addressMatch',
        'salary': 'salaryMatch',
        'skills': 'abilityMatch'
    }

    # 检查是否为有效的筛选条件
    if criteria not in sort_fields:
        return jsonify({'message': '无效的筛选条件'}), 400

    # 获取排序字段
    sort_field = sort_fields[criteria]

    # 生成SQL查询，计算匹配度
    sql_query = f'''
               SELECT ci.id, ci.name, ci.job, ci.description, ci.education, ci.manager, ci.salary, ci.address, ci.link, ci.city, ci.skills, ci.lastActive,
                      ROUND((0.4 * rj.{sort_field} + 0.2 * (rj.educationMatch + rj.addressMatch + rj.salaryMatch + rj.abilityMatch - rj.{sort_field}))*100, 3) as match,
                      rj.educationMatch, rj.addressMatch, rj.salaryMatch, rj.abilityMatch
               FROM recommended_jobs rj
               JOIN company_info ci ON rj.job_id = ci.id
               WHERE rj.user_id = ?
               ORDER BY match DESC
               LIMIT 20
           '''

    cursor.execute(sql_query, (user_id,))
    jobs = cursor.fetchall()

    if not jobs:
        return jsonify({'message': '未找到推荐职位'}), 404

    # 获取列名
    columns = [column[0] for column in cursor.description]
    # 将每个查询结果转换为字典
    jobs_list = [dict(zip(columns, job)) for job in jobs]

    conn.close()
    return jsonify(jobs_list), 200
