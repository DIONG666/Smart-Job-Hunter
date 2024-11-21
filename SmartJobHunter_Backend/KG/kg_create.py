import csv
import re
from py2neo import Graph, Node, Relationship, NodeMatcher

graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")

# 添加关键词列表
with open('keywords.txt', 'r', encoding='utf-8') as file:
    keywords = file.read().split('、')
# 添加城市列表
with open('cityname.txt', 'r', encoding='utf-8') as file:
    cities = file.read().splitlines()

# 创建城市节点
for city in cities:
    city_node = Node("City", name=city)
    graph.merge(city_node, "City", "name")

# 定义函数，用于创建公司节点和招聘岗位节点，并建立关系
def create_knowledge_graph(data):
    # 创建学历要求节点
    education_requirement_dict = {
        "大专": Node("EducationRequirement", name="大专"),
        "本科": Node("EducationRequirement", name="本科"),
        "硕士": Node("EducationRequirement", name="硕士"),
        "博士": Node("EducationRequirement", name="博士")
    }

    for education_node in education_requirement_dict.values():
        graph.merge(education_node, "EducationRequirement", "name")

    # 建立学历要求等级关系
    matcher = NodeMatcher(graph)
    for edu_name, edu_node in education_requirement_dict.items():
        higher_edu_nodes = [node for node in education_requirement_dict.values() if node != edu_node]
        for higher_edu_node in higher_edu_nodes:
            relationship = Relationship(edu_node, "REQUIRES_HIGHER_THAN", higher_edu_node)
            graph.merge(relationship)

    for row in data:
        try:
            identity = row[0]
            company_name = row[1]
            job_title = row[2]
            education_requirement_name = row[4]

            # 检查该公司是否已存在
            existing_company = graph.nodes.match("Company", name=company_name).first()
            if not existing_company:
                company_node = Node("Company", name=company_name)
                graph.merge(company_node, "Company", "name")  # 添加主标签和主键信息
            else:
                company_node = existing_company

            # 检查该招聘岗位是否已存在
            existing_job = graph.nodes.match("Job", title=job_title).first()
            if not existing_job:
                job_node = Node("Job", title=job_title)
                graph.merge(job_node, "Job", "title")  # 添加主标签和主键信息
            else:
                job_node = existing_job

            # 创建id节点
            identity_node = Node("Identity", name=identity, repsonsibility=row[5])
            graph.merge(identity_node, "Identity", "name")

            # 创建学历要求节点并建立关系
            if education_requirement_name in education_requirement_dict.keys():
                education_requirement_node = education_requirement_dict[education_requirement_name]
                relationship = Relationship(identity_node, "REQUIRES", education_requirement_node)
                graph.merge(relationship)

            # 创建薪资节点
            salary_range = row[3]
            salary_node = Node("Salary", name=salary_range)
            graph.merge(salary_node, "Salary", "name")

            # 创建联系人节点
            contact_name = row[6]
            contact_node = Node("Contact", name=contact_name)
            graph.merge(contact_node, "Contact", "name")

            # 创建活跃状态节点
            activity = row[7]
            activity_node = Node("Activity", name=activity)
            graph.merge(activity_node, "Activity", "name")

            # 创建公司地址节点
            address = row[8]
            address_node = Node("Address", name=address)
            graph.merge(address_node, "Address", "name")

            # 检查address是否包含任何城市名，如果是则创建关系边
            for city in cities:
                if city in address:
                    city_node = graph.nodes.match("City", name=city).first()
                    if city_node:
                        relationship_city = Relationship(identity_node, "LOCATED_IN", city_node)
                        graph.merge(relationship_city, "LOCATED_IN")
                    break

            # 创建网址节点
            website = row[9]
            website_node = Node("Website", name=website)
            graph.merge(website_node, "Website", "name")




            # 建立关系
            relationship0 = Relationship(identity_node, "HAS_COMPANY", company_node)
            relationship00 = Relationship(identity_node, "HAS_JOB", job_node)
            relationship1 = Relationship(company_node, "RECRUITS", identity_node)
            relationship2 = Relationship(identity_node, "HAS_CONTACT", contact_node)
            relationship3 = Relationship(identity_node, "HAS_ACTIVITY", activity_node)
            relationship4 = Relationship(identity_node, "HAS_ADDRESS", address_node)
            relationship5 = Relationship(identity_node, "HAS_WEBSITE", website_node)
            relationship6 = Relationship(job_node, "RECRUIT_BY", identity_node)
            relationship7 = Relationship(identity_node, "HAS_SALARY", salary_node)

            graph.merge(relationship0, "HAS_COMPANY")  # 添加关系的主标签
            graph.merge(relationship00, "HAS_JOB")  # 添加关系的主标签
            graph.merge(relationship1, "RECRUITS")  # 添加关系的主标签
            graph.merge(relationship2, "HAS_CONTACT")  # 添加关系的主标签
            graph.merge(relationship3, "HAS_ACTIVITY")  # 添加关系的主标签
            graph.merge(relationship4, "HAS_ADDRESS")  # 添加关系的主标签
            graph.merge(relationship5, "HAS_WEBSITE")  # 添加关系的主标签
            graph.merge(relationship6, "RECRUIT_BY")  # 添加关系
            graph.merge(relationship7, "HAS_SALARY")

            # 创建关键词节点并建立关系
            for keyword in keywords:
                if keyword in row[5]:
                    keyword_node = Node("Keyword", name=keyword)
                    graph.merge(keyword_node, "Keyword", "name")
                    relationship_keyword = Relationship(identity_node, "CONTAINS", keyword_node)
                    graph.merge(relationship_keyword, "CONTAINS")
        except Exception as e:
            print(f"Error processing row: {row}")
            print(f"Error message: {e}")
            continue


# 数据清洗函数，去除不符合要求的数据
def clean_data(data):
    cleaned_data = []
    for row in data:
        if len(row) == 10:  # 确保每行数据有10列
            # 清洗职位薪资范围
            salary_range = row[3]
            cleaned_salary_range = re.findall(r'\d+', salary_range)
            if len(cleaned_salary_range) == 2:
                row[3] = f"{cleaned_salary_range[0]}K - {cleaned_salary_range[1]}K"
            else:
                continue  # 如果薪资范围不符合要求，则跳过该行数据

            cleaned_data.append(row)

    return cleaned_data


# 读取CSV文件
with open('../data_all.csv', 'r', encoding='utf-8') as file:
    csv_data = csv.reader(file)
    next(csv_data)  # 跳过标题行
    raw_data = list(csv_data)

# 数据清洗
cleaned_data = clean_data(raw_data)

# 创建知识图谱
create_knowledge_graph(cleaned_data)
