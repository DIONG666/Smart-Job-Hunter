import requests
import json
from typing import List, Dict
from readResume import read_pdf_file

class DeepSeekInterviewer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.deepseek.com/chat/completions"  # 请根据实际API地址修改
        self.conversation_history = []

        # 可微调参数
        self.temperature = 0.7  # 控制生成随机性 (0~2)
        self.max_tokens = 500  # 生成内容最大长度
        self.top_p = 0.9  # 采样阈值
        self.stop_sequences = ["面试结束"]  # 停止序列
        # self.frequency_penalty = 1.0 # 控制内容重复 (-2~2)

        # 初始化系统提示
        self._init_system_prompt()

    def _init_system_prompt(self):
        system_prompt = """你是一个专业的AI面试官，需要根据候选人的简历信息进行技术面试。请遵循以下规则：
        1. 首先分析简历中的专业技能和工作经历
        2. 生成与岗位要求相关的技术问题
        3. 根据候选人的回答进行追问或生成新问题
        4. 面试持续5轮后进入评价阶段
        5. 使用专业但友好的语气
        """
        self.add_message("system", system_prompt)

    def add_message(self, role: str, content: str):
        self.conversation_history.append({"role": role, "content": content})

    def generate_questions(self, resume: str) -> str:
        # 首次生成问题
        self.add_message("user", f"这是我的简历：{resume}\n请开始面试")
        return self._call_api()

    def process_answer(self, user_answer: str) -> str:
        # 处理用户回答并生成后续问题
        self.add_message("user", user_answer)
        return self._call_api()

    def _call_api(self) -> str:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": "deepseek-chat",  # 根据实际模型名称修改
            "messages": self.conversation_history,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "top_p": self.top_p,
            "stop": self.stop_sequences,
        }

        try:
            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()

            result = response.json()
            ai_response = result['choices'][0]['message']['content']
            self.add_message("assistant", ai_response)

            return ai_response
        except Exception as e:
            return f"API调用出错：{str(e)}"

    def evaluate_interview(self) -> str:
        # 生成最终评价
        evaluation_prompt = """请基于上述面试对话，从以下维度生成评估报告：
        1. 技术能力匹配度
        2. 问题解决能力
        3. 沟通表达能力
        4. 改进建议"""

        self.add_message("user", evaluation_prompt)
        return self._call_api()


if __name__ == '__main__':
    API_KEY = "your_api_key_here"
    resume_content = read_pdf_file("test.pdf")

    interviewer = DeepSeekInterviewer(API_KEY)

    # 生成初始问题
    first_question = interviewer.generate_questions(resume_content)
    print("面试官：", first_question)

    # 模拟多轮对话
    for _ in range(4):
        user_input = input("求职者回答：")
        next_question = interviewer.process_answer(user_input)
        print("面试官：", next_question)

    # 生成最终评价
    evaluation = interviewer.evaluate_interview()
    print("\n面试评价：\n", evaluation)
