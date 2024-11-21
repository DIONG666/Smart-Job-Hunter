from flask import Flask, request, jsonify, Blueprint
import sqlite3
import threading
from py2neo import Graph, Node, Relationship
import json
import time
from datetime import datetime, timedelta
from Identity_and_Infomation.loginRec import recommend_resumes

with open('keywords.txt', 'r', encoding='utf-8') as file:
    keywords = file.read().split('、')
# 添加城市列表
with open('cityname.txt', 'r', encoding='utf-8') as file:
    cities = file.read().splitlines()

companies = Blueprint('companies', __name__)
DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def calculate_last_active(created_at):
    today = datetime.now().date()
    delta = today - created_at
    if delta.days == 0:
        return "刚刚活跃"
    elif delta.days <= 7:
        return f"{delta.days}天之内活跃"
    elif delta.days <= 28:
        weeks = delta.days // 7
        return f"{weeks}周之内活跃"
    else:
        months = delta.days // 30  # 简化计算，假设每个月30天
        return f"{months}月之内活跃"


@companies.route('/companies/get-info/<int:user_id>', methods=['GET'])
def get_company_info(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
            SELECT name, job, description, education,
                   manager, salary, address, link
            FROM company_info WHERE user_id = ?
        ''', (user_id,))
    info = cursor.fetchone()

    if not info:
        return jsonify({'message': '用户信息不存在'}), 404

    # 获取列名
    columns = [column[0] for column in cursor.description]
    # 将每个查询结果转换为字典
    info_dict = dict(zip(columns, info)) if info else {}

    conn.close()
    return jsonify(info_dict), 200


@companies.route('/companies/get-all-info/<int:user_id>', methods=['GET'])
def get_company_all_info(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
            SELECT name, job, description, education,
                   manager, salary, address, link
            FROM company_info WHERE user_id = ?
        ''', (user_id,))
    infos = cursor.fetchall()  # 使用fetchall来获取所有匹配的行

    if not infos:
        return jsonify({'message': '用户信息不存在'}), 404

    # 初始化一个列表来存储所有信息字典
    infos_list = []

    # 获取列名
    columns = [column[0] for column in cursor.description]

    # 遍历所有查询结果，将每个结果转换为字典，并添加到列表中
    for info in infos:
        info_dict = dict(zip(columns, info))
        infos_list.append(info_dict)

    conn.close()
    return jsonify(infos_list), 200



@companies.route('/companies/create-info', methods=['POST'])
def create_company_info():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM user WHERE id = ?', (data['userId'],))
    user = cursor.fetchone()
    if not user:
        return jsonify({'message': '用户不存在'}), 404

    cursor.execute('UPDATE user SET identity = ? WHERE id = ?', (data['identity'], data['userId']))

    # ljl:创建数据表
    cursor.execute('''CREATE TABLE IF NOT EXISTS company_info (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    user_id INTEGER NOT NULL,
                                                    name nchar(30),
                                                    job nchar(30),
                                                    description nvarchar(255),
                                                    education nchar(4),
                                                    manager nchar(10),
                                                    salary char(20),
                                                    created_at DATE,
                                                    lastActive nchar(30),
                                                    address nvarchar(30),
                                                    link varchar(150),
                                                    skills varchar(255),
                                                    city nchar(30),
                                                    FOREIGN KEY(user_id) REFERENCES user(id)
                                                )''')

    # 检查是否已有企业信息
    cursor.execute('SELECT * FROM company_info WHERE user_id = ?', (data['userId'],))
    existing_info = cursor.fetchone()

    created_at = datetime.now().date()  # 假设前端传来的日期格式是'YYYY-MM-DD'
    lastActive = calculate_last_active(created_at)

    # 实体抽取
    skills = []
    city = None

    # 创建关键词节点并建立关系
    for keyword in keywords:
        if keyword in data['description']:
            skills.append(keyword)
    for c in cities:
        if c in data['address']:
            city = c
            break
    # 插入新数据
    skills_json = json.dumps(skills, ensure_ascii=False)
    if existing_info:
        # 更新现有记录
        cursor.execute('''
            UPDATE company_info
            SET name = ?, job = ?, description = ?, education = ?, manager = ?, salary = ?, address = ?, link = ?,skills=?,city=?, created_at=?, lastActive=?
            WHERE user_id = ?
        ''', (data['name'], data['job'], data['description'], data['education'], data['manager'],
              data['salary'], data['address'], data['link'], skills_json, city, created_at, lastActive, data['userId'],))
    else:
        cursor.execute('''
                        INSERT INTO company_info (user_id, name, job, salary, education, description, manager, address, link,skills,city, created_at, lastActive) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
                    ''', (
            data['userId'], data['name'], data['job'], data['description'], data['education'], data['manager'],
            data['salary'], data['address'], data['link'], city, created_at, skills_json, city,))

    conn.commit()

    def async_process(data):
        # ljl:将企业信息转换为json文件
        user_id = data['userId']
        company_info = fetch_company_info(user_id)
        save_company_info_to_json(company_info)
        # ljl:加入为学生匹配职位的知识图谱中(职位id+职位要求)
        # graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")
        # data = request.get_json()
        # identity = data['user_id']
        # # 添加关键词列表
        # with open('keywords.txt', 'r', encoding='utf-8') as file:
        #     keywords = file.read().split('、')
        #
        # # 创建identity节点
        # identity_node = Node("Identity", name=identity, responsibility=data['description'])
        # graph.merge(identity_node, "Identity", "name")
        #
        # # 为行中的每个关键词创建keyword节点并建立关系
        # for keyword in keywords:
        #     if keyword in data['description']:
        #         keyword_node = graph.nodes.match("Keyword", name=keyword).first()
        #         if not keyword_node:
        #             keyword_node = Node("Keyword", name=keyword)
        #             graph.merge(keyword_node, "Keyword", "name")
        #         relationship = Relationship(identity_node, "CONTAINS", keyword_node)
        #         graph.merge(relationship)

        # grj:调用人才推荐函数(ljl:推荐函数中记得增加创建及存储推荐人才（学生）id+契合度的数据库)
        resumes_data_path = 'resumes.json'
        work_id = user_id
        # 假设的特定工作ID
        all_info_path = 'all_info.json'
        city_location_path = 'city_coordinates_cache.json'
        all_scores = recommend_resumes(resumes_data_path, work_id, all_info_path, city_location_path)
        # 数据库操作
        conn = get_db_connection()
        cursor = conn.cursor()
        # 创建推荐候选人表
        cursor.execute('''
                CREATE TABLE IF NOT EXISTS recommended_candidates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    candidate_id INTEGER NOT NULL,
                    match REAL NOT NULL,
                    educationMatch REAL NOT NULL,
                    addressMatch REAL NOT NULL,
                    salaryMatch REAL NOT NULL,
                    abilityMatch REAL NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES user(id),
                    FOREIGN KEY(candidate_id) REFERENCES student_info(id)
                );
                ''')

        cursor.execute('DELETE FROM recommended_candidates WHERE user_id = ?', (user_id,))
        conn.commit()

        # 遍历返回的数据并插入数据库表中
        for score_data in all_scores:
            # 提取各项数据
            resume_id = score_data["resume_id"][0]
            weighted_score = score_data["weighted_score"]
            skill_score = score_data["skill_score"]
            education_score = score_data["education_score"]
            salary_score = score_data["salary_score"]
            city_score = score_data["city_score"]

            # 执行插入操作
            cursor.execute('''
                        INSERT INTO recommended_candidates (user_id, candidate_id, match, abilityMatch, educationMatch, salaryMatch, addressMatch)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (user_id, resume_id, weighted_score, skill_score, education_score, salary_score, city_score))

        # # 执行数据库查询
        # cursor.execute('SELECT * FROM recommended_candidates where id=?', (user_id,))

        # # 获取查询结果
        # rows = cursor.fetchone()
        #
        # # 将查询结果转换为字典列表
        # results = []
        # for row in rows:
        #     result = {
        #         'resume_id': row[0],
        #         'weighted_score': row[1],
        #         'skill_score': row[2],
        #         'education_score': row[3],
        #         'salary_score': row[4],
        #         'city_score': row[5]
        #     }
        #     results.append(result)
        #
        # # 将字典列表转换为JSON格式的字符串
        # json_data = json.dumps(results)
        #
        # # 打印JSON数据（或者根据需要进行其他处理）
        # print(json_data)
        conn.commit()
        conn.close()

    # 在另一个线程中运行推荐算法和其他耗时操作
    threading.Thread(target=async_process, args=(data,)).start()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE user SET first_login = 0 WHERE id = ?', (data['userId'],))
    conn.commit()
    conn.close()
    return jsonify({'message': '企业信息提交成功'}), 200


# ljl修改
def fetch_company_info(user_id):
    conn = sqlite3.connect('Information.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT id, user_id, education,salary,address,skills,city FROM company_info where user_id=?',
                   (user_id,))
    company_info_row = cursor.fetchone()
    company_info_dist = dict(company_info_row)
    conn.close()
    return company_info_dist


def save_company_info_to_json(company_info, filename='all_info.json'):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = []

    # 检查并更新或追加公司信息
    updated = False
    for i, existing_info in enumerate(existing_data):
        if existing_info['user_id'] == company_info['user_id']:
            if isinstance(company_info['skills'], str):
                company_info['skills'] = json.loads(company_info['skills'])
            existing_data[i] = company_info  # 更新公司信息
            updated = True
            break

    if not updated:
        existing_data.append(company_info)  # 追加新的公司信息

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, ensure_ascii=False, indent=4)
