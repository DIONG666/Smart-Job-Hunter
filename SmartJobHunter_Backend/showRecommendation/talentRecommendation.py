from flask import Flask, request, jsonify, Blueprint
import sqlite3
import time

talents = Blueprint('talents', __name__)

DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # 方便后面将行数据转化为字典
    return conn


@talents.route('/talents/recommended/<int:user_id>', methods=['GET'])
def get_recommended_talents(user_id):
    time.sleep(1.5)
    conn = get_db_connection()
    cursor = conn.cursor()
    # 查询推荐人才ID和匹配度
    cursor.execute('''
               SELECT si.id, si.name, si.sex, si.lowestSalary, si.highestSalary, si.phone, si.education, si.year, si.intention, si.intentionCity, si.email, si.profession, si.educationExperience, si.internship, si.project, si.advantage, si.skills,
                      rc.match, rc.educationMatch, rc.salaryMatch, rc.addressMatch, rc.abilityMatch
               FROM recommended_candidates rc
               JOIN student_info si ON rc.candidate_id = si.id
               WHERE rc.user_id = ?
               ORDER BY rc.match DESC
               LIMIT 20
           ''', (user_id,))
    candidates = cursor.fetchall()
    if not candidates:
        return jsonify({'message': '未找到推荐人才'}), 404

    # 获取列名
    columns = [column[0] for column in cursor.description]
    # 将每个查询结果转换为字典
    candidates_list = [dict(zip(columns, candidate)) for candidate in candidates]

    conn.close()
    # print(candidates_list)
    return jsonify(candidates_list), 200
    

@talents.route('/talents/sort/<int:user_id>/<criteria>', methods=['GET'])
def sort_candidates(user_id, criteria):
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

    # 筛选并查询推荐职位ID和匹配度
    sql_query = f'''
                   SELECT si.id, si.name, si.sex, si.lowestSalary, si.highestSalary, si.phone, si.education, si.year, si.intention, si.intentionCity, si.email, si.profession, si.educationExperience, si.internship, si.project, si.advantage, si.skills,
                   ROUND((0.4 * rc.{sort_field} + 0.2 * (rc.educationMatch + rc.addressMatch + rc.salaryMatch + rc.abilityMatch - rc.{sort_field}))*100, 3) as match,
                   rc.educationMatch, rc.salaryMatch, rc.addressMatch, rc.abilityMatch
                   FROM recommended_candidates rc
                   JOIN student_info si ON rc.candidate_id = si.id
                   WHERE rc.user_id = ?
                   ORDER BY match DESC
                   LIMIT 20
               '''.format(sort_field)

    cursor.execute(sql_query, (user_id,))
    candidates = cursor.fetchall()

    if not candidates:
        return jsonify({'message': '未找到推荐人才'}), 404

    # 获取列名
    columns = [column[0] for column in cursor.description]
    # 将每个查询结果转换为字典
    candidates_list = [dict(zip(columns, candidate)) for candidate in candidates]

    conn.close()
    return jsonify(candidates_list), 200
