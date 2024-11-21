import pandas as pd
import numpy as np
from transformers import BertTokenizer, BertModel
import json


def resumes_embedding(resumesJson_path):
    resumes_path = resumesJson_path
    # 加载多个简历信息
    with open(resumes_path, 'r') as file:
        resumes_data = json.load(file)

    # 初始化BERT模型
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    bert_model = BertModel.from_pretrained('bert-base-uncased')

    # 准备简历向量数据列表
    resumes_embeddings_list = []
    for resume_info in resumes_data:
        # 只关注指定的字段
        relevant_info = {k: v for k, v in resume_info.items() if
                         k in ["age", "intention", "skills", "major", "city", "salary", "education"]}
        # 组合相关信息为一个文本描述
        resume_text = " ".join([f"{key}: {value}" for key, value in relevant_info.items() if value is not None])

        # 将简历文本转换为向量表示
        inputs = tokenizer(resume_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        outputs = bert_model(**inputs)
        resume_embedding = outputs.last_hidden_state.mean(dim=1).detach().numpy().flatten()

        # 将简历ID和向量合并，准备写入CSV
        resumes_embeddings_list.append([resume_info['id']] + resume_embedding.tolist())

    # 保存到CSV文件
    resumes_embedding_path = 'resumes_embedding.csv'
    # 使用Pandas DataFrame来存储和写入CSV，确保第一列是简历ID
    df_resumes_embeddings = pd.DataFrame(resumes_embeddings_list)
    df_resumes_embeddings.to_csv(resumes_embedding_path, index=False, header=False)

    print("Resumes embeddings saved successfully.")


# 调用函数
resumes_path = 'resumes.json'
resumes_embedding(resumes_path)
