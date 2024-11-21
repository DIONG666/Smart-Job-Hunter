import csv
from py2neo import Graph

# 连接到 Neo4j 数据库
graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")

# 提取三元组信息
def extract_triples_to_csv():
    triples = []


    # 查询知识图谱中的三元组
    query = """
    MATCH (subject)-[relation]->(object)
    RETURN subject, type(relation), object
    """
    results = graph.run(query)

    for result in results:
        triples.append([result['subject']['name'], result['type(relation)'], result['object']['name']])

    # 写入CSV文件
    with open('triples_from_knowledge_graph.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Subject', 'Relation', 'Object'])
        for triple in triples:
            writer.writerow(triple)

if __name__ == "__main__":
    extract_triples_to_csv()
