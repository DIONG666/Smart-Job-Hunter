import json
from transformers import BertTokenizer, BertModel
# 加载简历信息
resume_path = 'resume.json'
with open(resume_path, 'r') as file:
    resume_data = json.load(file)

# 组合简历信息为一个文本描述
resume_text = " ".join([f"{key}: {value}" for key, value in resume_data.items()])

# 初始化BERT模型
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

# 将简历文本转换为向量表示
inputs = tokenizer(resume_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
outputs = bert_model(**inputs)
resume_embedding = outputs.last_hidden_state.mean(dim=1)

# 简历向量
resume_embedding = resume_embedding.detach().numpy()

# 假设resume_embedding是简历的向量表示
resume_embedding_str = ','.join(map(str, resume_embedding.flatten()))
resume_save_path = 'resume_embedding.csv'
with open(resume_save_path, 'w') as f:
    f.write(resume_embedding_str)

print("save successfully")