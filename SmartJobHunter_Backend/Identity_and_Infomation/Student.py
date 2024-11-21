from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from Identity_and_Infomation.newRec import recommend_jobs
import os
import sqlite3
import threading
import pdfplumber
import re
import json
import time
from py2neo import Graph, Node, Relationship

students = Blueprint('students', __name__)

DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@students.route('/resume/upload/<int:user_id>', methods=['POST'])
def upload_resume(user_id):
    file = request.files['file']

    if file:
        filename = secure_filename(file.filename)
        filename = f"{user_id}_{filename}"
        # 检查文件是否为PDF格式
        if not filename.lower().endswith('pdf'):
            return jsonify({'message': '文件格式不正确，请上传PDF文件'}), 422

        # 保存文件到公共目录
        public_resumes_dir = os.path.join(current_app.root_path, 'public', 'resumes')
        if not os.path.exists(public_resumes_dir):
            os.makedirs(public_resumes_dir)
        file_path = os.path.join(public_resumes_dir, filename)
        file.save(file_path)

        # 构建可通过Web访问的URL
        web_accessible_url = request.url_root.rstrip('/') + '/public/resumes/' + filename

        # 实体提取逻辑
        text = read_pdf_file(file_path)
        resume_info = extract_info_from_pdf_resume(text)
        skills_str = ', '.join(resume_info.get('专业技能')) if resume_info.get('专业技能') else ''

        # 将提取的信息和隐私设置存储到学生信息表中
        conn = get_db_connection()
        cursor = conn.cursor()

        # ljl:创建数据表
        cursor.execute('''CREATE TABLE IF NOT EXISTS student_info (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            name nchar(5),
                            sex nchar(2),
                            lowestSalary varchar(5),
                            highestSalary varchar(5),
                            phone char(15),
                            education nchar(4),
                            year int,
                            intention nvarchar(20),
                            intentionCity nvarchar(5),
                            email varchar(30),
                            profession nvarchar(20),
                            educationExperience text,
                            internship text,
                            project text,
                            advantage text,
                            privacy_setting int check(privacy_setting in(0,1,2)),
                            skills varchar(255),
                            resume_path TEXT,
                            FOREIGN KEY(user_id) REFERENCES user(id)
                        )''')

        cursor.execute('''
                SELECT * FROM student_info WHERE user_id = ?
            ''', (user_id,))
        existing_info = cursor.fetchone()

        if resume_info.get('期望薪资下限'):
            lowestSalary = resume_info.get('期望薪资下限')*1000
        else:
            lowestSalary = None
        if resume_info.get('期望薪资上限'):
            highestSalary = resume_info.get('期望薪资上限')*1000
        else:
            highestSalary = None

        if existing_info:
            # ljl:如果已存在，更新信息
            cursor.execute('''
                    UPDATE student_info SET name = ?, sex = ?, lowestSalary = ?, highestSalary = ?,
                    phone = ?, education = ?, year = ?, intention = ?, intentionCity = ?, email = ?, 
                    profession = ?, educationExperience = ?, internship = ?, project = ?, advantage = ?,
                    resume_path = ?, skills = ?
                    WHERE user_id = ?
                ''', (resume_info.get('姓名'), resume_info.get('性别'), lowestSalary,
                      highestSalary, resume_info.get('联系电话'),
                      resume_info.get('学历'), resume_info.get('年龄'), resume_info.get('求职意向'),
                      resume_info.get('意向城市'), resume_info.get('电子邮箱'),
                      resume_info.get('专业'), resume_info.get('教育经历'), resume_info.get('工作经历'),
                      resume_info.get('项目经历'), resume_info.get('个人优势'), web_accessible_url,
                      skills_str, user_id))
        else:
            # ljl:插入数据
            cursor.execute('''
                        INSERT INTO student_info (user_id, name,sex,lowestSalary, highestSalary,phone,education,
                        year,intention,intentionCity,email,profession,educationExperience,internship,project,advantage,
                        resume_path,skills)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                           (user_id, resume_info.get('姓名'), resume_info.get('性别'), lowestSalary,
                            highestSalary, resume_info.get('联系电话'),
                            resume_info.get('学历'), resume_info.get('年龄'), resume_info.get('求职意向'),
                            resume_info.get('意向城市'), resume_info.get('电子邮箱'),
                            resume_info.get('专业'), resume_info.get('教育经历'), resume_info.get('工作经历'),
                            resume_info.get('项目经历'), resume_info.get('个人优势'), web_accessible_url,
                            skills_str))
        conn.commit()
        conn.close()

        return jsonify({'message': '简历上传成功'}), 200
    else:
        return jsonify({'message': '文件上传失败'}), 400


@students.route('/resume/post-info/<int:user_id>', methods=['POST'])
def post_resume_info(user_id):
    data = request.get_json()
    identity = data['identity']
    privacy_setting = data['privacySetting']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    if not user:
        return jsonify({'message': '用户不存在'}), 404

    cursor.execute('UPDATE user SET identity = ? WHERE id = ?', (identity, user_id))

    cursor.execute('''
                    SELECT * FROM student_info WHERE user_id = ?
                ''', (user_id,))
    existing_info = cursor.fetchone()

    if existing_info:
        # ljl:如果已存在，更新信息
        cursor.execute('''
                        UPDATE student_info SET privacy_setting = ?
                        WHERE user_id = ?
                    ''', (privacy_setting, user_id))
    else:
        # ljl:插入数据
        cursor.execute('''
                            INSERT INTO student_info (user_id, privacy_setting)
                            VALUES (?,?)''',
                       (user_id, privacy_setting))
    conn.commit()
    conn.close()

    return jsonify({'message': '隐私设置上传成功'}), 200


@students.route('/students/get-info/<int:user_id>', methods=['GET'])
def get_student_info(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT name, sex, lowestSalary, highestSalary,
               phone, education, year, intention, intentionCity, email, profession, 
               educationExperience, internship, project, advantage
        FROM student_info WHERE user_id = ?
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


@students.route('/students/update-info', methods=['PUT'])
def update_student_info():
    data = request.get_json()
    user_id = data['userId']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch privacy setting and existing info in one go
    cursor.execute('''
            SELECT * FROM student_info WHERE user_id = ?
        ''', (user_id,))
    existing_info = cursor.fetchone()

    if existing_info:
        privacy_setting = existing_info['privacy_setting']

        # Encrypt sensitive information if privacy setting is not 0
        if privacy_setting != 0:
            encrypted_info = encrypt(data['name'], data['phone'], data['email'])
        else:
            encrypted_info = {'name': data['name'], 'phone': data['phone'], 'email': data['email']}

        # Update the information in the database
        cursor.execute('''
                UPDATE student_info SET name = ?, sex = ?, lowestSalary = ?, highestSalary = ?,
                phone = ?, education = ?, year = ?, intention = ?, intentionCity = ?, email = ?, 
                profession = ?, educationExperience = ?, internship = ?, project = ?, advantage = ?
                WHERE user_id = ?
            ''', (encrypted_info['name'], data['sex'], data['lowestSalary'] * 1000, data['highestSalary'] * 1000,
                  encrypted_info['phone'], data['education'], data['year'], data['intention'], data['intentionCity'],
                  encrypted_info['email'], data['profession'], data['educationExperience'], data['internship'],
                  data['project'], data['advantage'], user_id))
    else:
        # If no existing record, insert a new record
        cursor.execute('''
                INSERT INTO student_info (user_id, name, sex, lowestSalary, highestSalary,
                phone, education, year, intention, intentionCity, email, profession, 
                educationExperience, internship, project, advantage) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, data['name'], data['sex'], data['lowestSalary'] * 1000, data['highestSalary'] * 1000,
                  data['phone'], data['education'], data['year'], data['intention'], data['intentionCity'],
                  data['email'], data['profession'], data['educationExperience'], data['internship'],
                  data['project'], data['advantage']))
    # ljl修改了一下提取逻辑
    with open('keywords.txt', 'r', encoding='utf-8') as file:
        keywords = file.read().split('、')
    skills = []
    data_str = json.dumps(data, ensure_ascii=False)
    for keyword in keywords:
        if keyword in data_str:
            skills.append(keyword)
    skills_json = json.dumps(skills, ensure_ascii=False)
    cursor.execute('''
                UPDATE student_info SET skills = ?
                WHERE user_id = ?
            ''', (skills_json, user_id))
    # print(data['educationExperience'], data['internship'], data['project'], data['advantage'],skills_json)
    conn.commit()
    conn.close()

    def async_process(data, user_id, privacySetting):
        # ljl:将学生信息转换为json文件
        # （在上面加了fetch_student_info和save_student_info_to_json函数）
        student_info = fetch_student_info(user_id)
        save_student_info_to_json(student_info)
        # ljl:如果隐私设置为公开，则加入为企业匹配求职者的知识图谱中(学生id+专业技能)
        # if privacySetting == 0:
        #     graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")
        #     user_node = Node("UserID", id=user_id)
        #     graph.merge(user_node, "UserID", "id")
        #     for skill in data['skills']:  # 直接遍历skills列表
        #         # 检查keyword节点是否已存在
        #         existing_keyword = graph.nodes.match("Keyword", name=skill).first()
        #         if not existing_keyword:
        #             keyword_node = Node("Keyword", name=skill)
        #             graph.merge(keyword_node, "Keyword", "name")
        #         else:
        #             keyword_node = existing_keyword
        #         # 建立UserID与Keyword之间的HASSKILL关系
        #         relationship = Relationship(user_node, "HASSKILL", keyword_node)
        #         graph.merge(relationship)

        # grj:调用职位推荐函数(ljl:推荐函数中记得增加创建及存储推荐职位id+契合度的数据库)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS recommended_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            job_id INTEGER NOT NULL,
            match REAL NOT NULL,
            educationMatch REAL NOT NULL,
            addressMatch REAL NOT NULL,
            salaryMatch REAL NOT NULL,
            abilityMatch REAL NOT NULL,
            evaluation text,
            FOREIGN KEY(user_id) REFERENCES user(id)
            FOREIGN KEY(job_id) REFERENCES company_info(id)
        );
        ''')

        # 调用函数并获取返回的数据
        resume_data_path = 'resumes.json'
        all_info_path = 'all_info.json'
        city_location_path = 'city_coordinates_cache.json'
        all_scores = recommend_jobs(resume_data_path, user_id, all_info_path, city_location_path)

        cursor.execute('DELETE FROM recommended_jobs WHERE user_id = ?', (user_id,))
        conn.commit()
        # 遍历返回的数据并插入数据库表中（这里有一点不确定，架设了all_score有多项数据）
        for score_data in all_scores:
            # 提取各项数据
            work_id = score_data["work_id"][0]
            weighted_score = score_data["weighted_score"]
            skill_score = score_data["skill_score"]
            education_score = score_data["education_score"]
            salary_score = score_data["salary_score"]
            city_score = score_data["city_score"]

            # 执行插入操作
            cursor.execute('''
                INSERT INTO recommended_jobs (user_id, job_id, match, abilityMatch, educationMatch, salaryMatch, addressMatch)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, work_id, weighted_score, skill_score, education_score, salary_score, city_score))

        # # 执行数据库查询
        # cursor.execute('SELECT * FROM recommended_jobs where id=?',(user_id,))
        #
        # # 获取查询结果
        # rows = cursor.fetchone()
        #
        # # 将查询结果转换为字典列表
        # results = []
        # for row in rows:
        #     result = {
        #         'work_id': row[0],
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
        # # print(json_data)
        conn.commit()
        conn.close()

    # 在另一个线程中运行推荐算法和其他耗时操作
    threading.Thread(target=async_process, args=(data, user_id, data.get('privacySetting'))).start()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE user SET first_login = 0 WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': '信息更新成功'}), 200


# ljl修改：加入了两个函数供转成json文件使用
def fetch_student_info(user_id):
    conn = sqlite3.connect('Information.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        'SELECT id, user_id,intentionCity,lowestSalary,highestSalary,skills,education FROM student_info where user_id=?',
        (user_id,))
    student_info_row = cursor.fetchone()
    student_info_dict = dict(student_info_row)
    conn.close()
    return student_info_dict


def save_student_info_to_json(student_info, filename='resumes.json'):
    import json
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = []

    # 统一处理 skills 字段为列表格式
    if isinstance(student_info.get('skills', ''), str):
        student_info['skills'] = json.loads(student_info['skills'])

    # 检查并更新或追加学生信息
    updated = False
    for i, existing_info in enumerate(existing_data):
        if existing_info['user_id'] == student_info['user_id']:
            existing_data[i] = student_info  # 更新学生信息
            updated = True
            break

    if not updated:
        existing_data.append(student_info)  # 追加新的学生信息

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, ensure_ascii=False, indent=4)



def read_pdf_file(filename):
    with pdfplumber.open(filename) as pdf:
        first_page = pdf.pages[0]
        text = first_page.extract_text()
    return text


# 其他函数保持不变
# 提取专业、城市、学历
def load_keywords_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        keywords = file.read().splitlines()
    return keywords


# 加载专业、城市、学历关键词
major_keywords = load_keywords_from_file('./Identity_and_Infomation/major.txt')
city_keywords = load_keywords_from_file('./Identity_and_Infomation/city.txt')
education_keywords = load_keywords_from_file('./Identity_and_Infomation/education.txt')


def match_keywords(text, keyword_file):
    with open(keyword_file, 'r', encoding='utf-8') as file:
        keywords = file.read().splitlines()
    matched_keywords = [keyword for keyword in keywords if keyword in text]
    return matched_keywords


def load_titles_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        titles = file.read().splitlines()
    return titles


def match_exact_keywords(text, keywords):
    matched_keywords = [keyword for keyword in keywords if keyword == text]
    return matched_keywords


# ljl:实体识别功能更新
def extract_info_from_pdf_resume(text):
    info = {}

    # 提取姓名
    name_pattern = r'([\u4e00-\u9fa5]{2,3})'  # 匹配2-3个汉字作为姓名
    name_match = re.search(name_pattern, text)
    info['姓名'] = name_match.group(1) if name_match else None

    # 提取年龄
    age_pattern = r'(\d{2})岁'  # 匹配两位数字加上"岁"字符
    age_match = re.search(age_pattern, text)
    info['年龄'] = int(age_match.group(1)) if age_match else None

    # 提取联系电话
    phone_pattern = r'(\d{11})'  # 匹配11位数字作为联系电话
    phone_match = re.search(phone_pattern, text)
    info['联系电话'] = phone_match.group(1) if phone_match else None

    # 提取电子邮件
    email_pattern = r'([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)'  # 匹配常见的电子邮件格式
    email_match = re.search(email_pattern, text)
    info['电子邮件'] = email_match.group(1) if email_match else None

    # 提取求职意向
    intention_keywords = ['求职意向', '期望岗位']
    intention = None
    for keyword in intention_keywords:
        if keyword in text:
            start_index = text.index(keyword) + len(keyword)
            end_index = text.find('\n\n', start_index)
            intention = text[start_index:end_index].strip()
            break
    if intention:
        titles = load_titles_from_file('./Identity_and_Infomation/title.txt')
        for title in titles:
            if title in intention:
                intention = title
                break
    info['求职意向'] = intention

    # 提取专业技能
    skills_keywords = ['技能', '熟悉', '了解']
    skills = None
    for keyword in skills_keywords:
        if keyword in text:
            start_index = text.index(keyword) + len(keyword)
            end_index = text.find('\n\n', start_index)  # 假设信息之间以双换行符分隔
            skills = text[start_index:end_index].strip()
            break
    if skills:
        matched_skills = match_keywords(skills, './Identity_and_Infomation/description.txt')
        skills = matched_skills
    info['专业技能'] = skills

    # 提取专业
    major = None
    for keyword in major_keywords:
        if keyword in text:
            major = keyword
            break
    info['专业'] = major

    # 提取城市
    city = None
    for keyword in city_keywords:
        if keyword in text:
            city = keyword
            break
    info['意向城市'] = city
    # 提取学历
    education = None
    for keyword in education_keywords:
        if keyword in text:
            education = keyword
            break
    info['学历'] = education
    # 提取性别
    gender_pattern = r'(男|女)'
    gender_match = re.search(gender_pattern, text)
    info['性别'] = gender_match.group(1) if gender_match else None

    # 提取期望薪资下限和上限
    salary_pattern = r'期望薪资：(\d+)-(\d+)K'
    salary_match = re.search(salary_pattern, text)
    info['期望薪资下限'] = int(salary_match.group(1)) if salary_match else None
    info['期望薪资上限'] = int(salary_match.group(2)) if salary_match else None

    # 提取教育经历
    education_section = re.search(r'教育经历([\s\S]*?)(?=资格证书|个人优势|工作经历|项目经历|$)', text)
    info['教育经历'] = education_section.group(1).strip() if education_section else None

    # 提取工作经历
    work_section = re.search(r'工作经历([\s\S]*?)(?=项目经历|个人优势|教育经历|$)', text)
    info['工作经历'] = work_section.group(1).strip() if work_section else None

    # 提取个人优势
    advantages_section = re.search(r'个人优势([\s\S]*?)(?=工作经历|项目经历|教育经历|$)', text)
    info['个人优势'] = advantages_section.group(1).strip() if advantages_section else None

    # 提取项目经历
    projects_section = re.search(r'项目经历([\s\S]*?)(?=工作经历|个人优势|教育经历|$)', text)
    info['项目经历'] = projects_section.group(1).strip() if projects_section else None

    # 插入数据到数据库
    # cursor.execute(
    #     "INSERT INTO resumes (name, age, phone, email, intention, major, city, education, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    #     (info['姓名'], info['年龄'], info['联系电话'], info['电子邮件'], info['求职意向'],
    #      info['专业'], info['意向城市'], info['学历'],
    #      ', '.join(info['专业技能']) if info['专业技能'] else None))
    # conn.commit()
    # 将信息转换为 JSON 字符串
    # json_data = json.dumps(info, ensure_ascii=False, indent=4)

    # 将 JSON 字符串写入文件
    # with open('resume_info.json', 'w', encoding='utf-8') as file:
    # file.write(json_data)
    return info


def encrypt(name, phone, email):
    new_name = ""
    if name != '':
        new_name = name[0]
        for i in range(len(name) - 1):
            new_name = new_name + '*'
    new_email = ""
    if email != '':
        new_email = email[0:3]
        temp = 2
        while email[temp] != '@':
            new_email = new_email + "*"
            temp = temp + 1
        while temp < len(email):
            new_email = new_email + email[temp]
            temp = temp + 1

    new_phone = ""
    if phone != '':
        new_phone = phone[0:3]
        for i in range(len(phone) - 3):
            new_phone = new_phone + '*'
    '''
    new_age=""
    if age!=None:
        new_age=""
        for i in range(len(age)):
            new_age=new_age+'*'
    '''
    result = {'name': new_name, 'phone': new_phone, 'email': new_email}
    # result['age']=new_age
    return result
# # 示例用法
# resume_text = read_pdf_file('凡广的简历.pdf')
# resume_info = extract_info_from_pdf_resume(resume_text)
# 关闭数据库连接
# cursor.close()
# conn.close()
# print(resume_info)
