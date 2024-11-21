import csv
import re
import json
from py2neo import Graph, Node, Relationship, NodeMatcher

graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")

# 添加关键词列表
with open('keywords.txt', 'r', encoding='utf-8') as file:
    keywords = file.read().split('、')


# 定义函数，用于创建身份节点和关键词节点，并建立关系
def create_identity_and_keyword_nodes(data):
    for row in data:
        try:
            identity = row[0]
            # 创建identity节点
            identity_node = Node("Identity", name=identity, responsibility=row[5])
            graph.merge(identity_node, "Identity", "name")

            # 为行中的每个关键词创建keyword节点并建立关系
            for keyword in keywords:
                if keyword in row[5]:  # 假设职责描述在row[5]中
                    keyword_node = graph.nodes.match("Keyword", name=keyword).first()
                    if not keyword_node:
                        keyword_node = Node("Keyword", name=keyword)
                        graph.merge(keyword_node, "Keyword", "name")
                    relationship = Relationship(identity_node, "CONTAINS", keyword_node)
                    graph.merge(relationship)
        except Exception as e:
            print(f"Error processing row: {row}")
            print(f"Error message: {e}")
            continue



# 读取CSV文件数据
def read_csv_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        csv_data = csv.reader(file)
        next(csv_data)  # 跳过标题行
        return list(csv_data)


# 主逻辑
def main():
    # 读取并处理企业招聘信息
    recruitment_data = read_csv_data('../data_all.csv')  # 假设数据文件名为data_all.csv
    create_identity_and_keyword_nodes(recruitment_data)


# 执行主逻辑
main()
