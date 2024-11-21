import json
from py2neo import Graph, Node, Relationship, NodeMatcher

graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")
# 添加关键词列表
with open('keywords.txt', 'r', encoding='utf-8') as file:
    keywords = file.read().split('、')


# 处理简历数据
def process_resumes(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        resumes = json.load(file)

    for resume in resumes:
        user_id = resume['id']
        skills = resume['skills'].split(', ')

        # 创建或匹配UserID节点
        user_node = Node("UserID", id=user_id)
        graph.merge(user_node, "UserID", "id")

        for skill in skills:
            # 检查keyword节点是否已存在
            existing_keyword = graph.nodes.match("Keyword", name=skill).first()
            if not existing_keyword:
                keyword_node = Node("Keyword", name=skill)
                graph.merge(keyword_node, "Keyword", "name")
            else:
                keyword_node = existing_keyword

            # 建立UserID与Keyword之间的HASSKILL关系
            relationship = Relationship(user_node, "HASSKILL", keyword_node)
            graph.merge(relationship)



# 主逻辑
def main():
    # 处理简历数据并添加到知识图谱
    process_resumes('resumes.json')


# 执行主逻辑
main()
