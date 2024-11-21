import pandas as pd
import torch
from pykeen.pipeline import pipeline
from pykeen.triples import TriplesFactory
import numpy as np

# 加载知识图谱数据
kg_path = 'kg_data.csv'  # 知识图谱数据文件路径
kg_df = pd.read_csv(kg_path, header=None, names=['head', 'relation', 'tail'])
# 确保所有列都是字符串类型
# kg_df = kg_df.astype(str)
# 检查并处理空值
kg_df = kg_df.dropna()  # 删除任何包含空值的行

# 将数据转换为PyKEEN能处理的格式
tf = TriplesFactory.from_labeled_triples(kg_df.values)

# 分割数据集为训练集、测试集（可选：验证集）
training_tf, testing_tf = tf.split([0.8, 0.2])  # 例如，80%用于训练，20%用于测试
# 如果需要验证集，可以这样分割：
# training_tf, testing_tf, validation_tf = tf.split([0.7, 0.2, 0.1])

# 使用分割后的数据集
result = pipeline(
    training=training_tf,
    testing=testing_tf,
    # validation=validation_tf,  # 如果有验证集的话
    model='TransE',
    model_kwargs={
       "embedding_dim": 768,  # 设置嵌入的维度为768
    },
    training_kwargs=dict(num_epochs=100),
    random_seed=42,
)


# 获取模型
model = result.model


# 假设model是已经训练好的TransE模型
# tf是对应的TriplesFactory实例

# 假设工作ID范围是1到8763，我们将它们转换为字符串，因为PyKEEN中的ID是以字符串形式存储
work_ids = list(map(str, range(1, 8764)))

# 初始化一个空列表来存储工作向量
work_embeddings = []

# 遍历每个工作ID，获取其向量表示
for work_id in work_ids:
    if work_id in tf.entity_to_id:  # 确保工作ID存在于知识图谱中
        entity_id = tf.entity_to_id[work_id]
        embedding = model.entity_representations[0](torch.tensor([entity_id], dtype=torch.long)).detach().cpu().numpy()
        work_embeddings.append((work_id, embedding))
    else:
        print(f"Work ID {work_id} not found in the knowledge graph.")

# 此时，work_embeddings 包含了每个工作ID及其向量表示的元组列表
print(f"Number of embeddings to write: {len(work_embeddings)}")
# 将工作ID和向量表示保存到CSV文件
with open('work_embeddings.csv', 'w') as f:
    for work_id, embedding in work_embeddings:
        # 将向量转换为逗号分隔的字符串
        embedding_str = ','.join(map(str, embedding.flatten()))
        f.write(f"{work_id},{embedding_str}\n")
        print(f"write {work_id} successfully")
