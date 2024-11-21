from py2neo import Graph
import csv

graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")

# 定义用于提取三元组的 Cypher 查询
query = """
MATCH (n)-[r]->(m) 
RETURN labels(n) AS StartNodeType, n.name AS StartNode, type(r) AS RelationshipType, m.name AS EndNode, labels(m) AS EndNodeType
"""

# 执行查询
results = graph.run(query)

# 保存结果到 CSV 文件
csv_file_path = 'kg_skill_triples.csv'
with open(csv_file_path, 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['StartNodeType', 'StartNode', 'RelationshipType', 'EndNode', 'EndNodeType'])  # 写入头部
    for record in results:
        writer.writerow([record['StartNodeType'], record['StartNode'], record['RelationshipType'], record['EndNode'], record['EndNodeType']])

print(f"三元组已保存到 {csv_file_path}")
