import csv
import sqlite3
import json
def match_keywords(text, keyword_file):
    with open(keyword_file, 'r', encoding='utf-8') as file:
        keywords = file.read().splitlines()
    matched_keywords = [keyword for keyword in keywords if keyword in text]
    return matched_keywords
with open('keywords.txt', 'r', encoding='utf-8') as file:
    keywords = file.read().split('、')
# 添加城市列表
with open('cityname.txt', 'r', encoding='utf-8') as file:
    cities = file.read().splitlines()
def insert_data_from_csv(csv_filepath):
    # 连接到数据库
    conn = sqlite3.connect('Information.db')
    cursor = conn.cursor()

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

    # 打开并读取CSV文件
    with open(csv_filepath, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # 跳过标题行
        for row in csv_reader:
            # 按照列的顺序提取数据，并跳过last_active列（假设为第8列，索引为7）
            # row的顺序: id, company, title, salary, education, description, hiring_manager, last_active, address, link
            skills=[]
            city=None

            # 创建关键词节点并建立关系
            for keyword in keywords:
                if keyword in row[5]:
                    skills.append(keyword)
            for c in cities:
                if c in row[8]:
                    city=c
                    break
            skills_json = json.dumps(skills, ensure_ascii=False)
            data_to_insert = [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9],skills_json,city]
            cursor.execute('''
                            INSERT INTO company_info (user_id, name, job, salary, education, description, manager, lastActive, address, link,skills,city) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
                        ''', data_to_insert)
    # 提交事务
    conn.commit()
    # 关闭数据库连接
    conn.close()

def export_data_to_json(output_filename):
    # 连接到数据库
    conn = sqlite3.connect('Information.db')
    conn.row_factory = sqlite3.Row  # 使得数据以字典形式返回
    cursor = conn.cursor()

    # 查询company_info3表中的所有数据
    cursor.execute('SELECT id, user_id, education,salary,address,skills,city FROM company_info')
    rows = cursor.fetchall()

    # 准备数据
    data = []
    for ix in rows:
        row_dict = dict(ix)
        # 对skills字段进行JSON解析
        row_dict['skills'] = json.loads(row_dict['skills']) if row_dict['skills'] else []
        data.append(row_dict)

    # 关闭数据库连接
    conn.close()

    # 写入JSON文件
    with open(output_filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


# 指定CSV文件路径
csv_file_path = 'data_all.csv'
# 调用函数，导入数据
insert_data_from_csv(csv_file_path)
# 导出数据到JSON文件
export_data_to_json('all_info.json')

print("CSV数据已导入数据库，并成功导出到all_info.json文件中。")
