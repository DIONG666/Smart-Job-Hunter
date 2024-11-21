from py2neo import Graph
import json

graph = Graph("http://localhost:7474", auth=("neo4j", "XzJEunfiT2G.t2Y"), name="neo4j")

def query_knowledge_graph():
    query = """
    MATCH (i:Identity)
    MATCH (i)-[:REQUIRES]->(e:EducationRequirement)
    OPTIONAL MATCH (i)-[:HAS_ADDRESS]->(a:Address)
    OPTIONAL MATCH (i)-[:HAS_SALARY]->(s:Salary)
    OPTIONAL MATCH (i)-[:CONTAINS]->(k:Keyword)
    OPTIONAL MATCH (i)-[:LOCATED_IN]->(c:City)
    RETURN i.name AS Identity, e.name AS Education_Requirement, a.name AS Address, s.name AS Salary_Range, COLLECT(k.name) AS Keywords, i.repsonsibility AS Responsibility, c.name AS City
    """

    result = graph.run(query).data()
    return result

def store_results_to_json():
    all_results = query_knowledge_graph()

    with open("all_info.json", "w", encoding='utf-8') as file:
        json.dump(all_results, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    store_results_to_json()
