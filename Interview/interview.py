import sqlite3
from openai import OpenAI
import random
from typing import Dict, List, Tuple
import json

DATABASE = 'globalData/Information.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ========== 可配置参数 ==========
CONFIG = {
    "api_key": "sk-d5909142d7994378be059ca4c85efd81",
    "temperature": 1.3,       # 生成温度
    "enable_stream": False,   # 是否启用流式输出
    "interviewer_tone": "温和而专业，保持鼓励性语气",
    
    # 预定义话题池（可扩展）
    "topic_prompts": [
        "请考察候选人对数据结构与算法的理解",
        "请评估候选人在软件工程实践方面的经验",
        "请测试候选人系统设计能力",
        "请考察计算机网络基础知识",
        "请评估操作系统核心概念掌握程度"
    ],
    
    # 开放性问题提示
    "open_question_prompt": "请提出一个考察职业规划或求职动机的开放性问题"
}

# ========== DeepSeek 客户端 ==========
client = OpenAI(
    api_key=CONFIG["api_key"],
    base_url="https://api.deepseek.com"
)

# ========== 核心功能实现 ==========
class AIInterviewer:
    def __init__(self):
        self.dialog_history = []
        self.current_topic = None
        self.topic_count = 0
        self.round_counter = 0

    def _build_system_prompt(self) -> str:
        """构建专业面试官系统提示"""
        evaluation_dimensions = [
            "技术深度（原理理解/实践经验）",
            "逻辑表达（结构化/条理性）",
            "自我反思（改进意识/学习能力）",
            "岗位匹配（技能相关性/发展潜力）"
        ]

        return f'''角色设定：
    你是在{self.position['title']}领域有10年经验的资深技术面试官，正在为{self.position['company']}公司进行校招面试。候选人背景如下：
    {self._format_candidate_profile()}

    面试目标：
    通过深度对话评估候选人的{self.position['title']}岗位适配度，重点关注：
    {self._format_evaluation_points(evaluation_dimensions)}

    行为准则：
    1. 提问策略：
       - 基础八股：考察核心概念理解（如："TCP为什么需要三次握手？"）
       - 项目追问：使用STAR法则深挖项目细节（如："你在项目中如何应对需求变更？"）
       - 情景模拟：设计技术场景题（如："如果QPS突然飙升，你会如何排查？"）

    2. 追问原则：
       - 当回答模糊时追问："你具体负责了哪些模块的实现？"
       - 当出现矛盾时澄清："这里和简历描述的时间线似乎不一致，能解释下吗？"
       - 对技术难点追问："当时遇到的最大挑战是什么？如何解决的？"

    3. 交互规范：
       - 每次只提一个问题
       - 避免专业术语堆砌，用"能否举例说明"引导阐述
       - 对不正确答案给予提示（如："这个理解有偏差，建议从XXX角度再思考"）

    岗位匹配分析：
    公司需求：{self.position['description']}
    核心要求：{self.position['core_requirements']}
    技术栈偏好：{self.position['tech_stack']}

    评分基准（供内部参考）：
    - 优秀（85+）：能展开技术细节，有反思总结
    - 合格（70+）：概念正确但缺乏深度
    - 待提升（<70）：关键概念错误或表述混乱'''

    def _format_candidate_profile(self) -> str:
        """结构化候选人背景"""
        return f'''【候选人档案】
    姓名：{self.candidate['name']}
    教育背景：{self.candidate['education']}
    技术标签：{', '.join(self.candidate['skills'])}
    项目经历：
    {self._format_projects()}
    实习经历：{self.candidate['internship'] or "无相关实习经验"}'''

    def _format_projects(self) -> str:
        """格式化项目经历"""
        return '\n'.join(
            f'- {proj["name"]}：{proj["description"][:50]}...'
            for proj in self.candidate['projects']
        )

    def _format_evaluation_points(self, dimensions: List[str]) -> str:
        """生成评估要点"""
        return '\n'.join(f'• {d}' for d in dimensions)
    
    def _get_next_question(self, last_response: str = None) -> str:
        """获取下一个问题"""
        messages = [
            {"role": "system", "content": self._build_system_prompt()},
            *self.dialog_history
        ]
        
        if last_response:
            messages.append({"role": "user", "content": last_response})
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=CONFIG["temperature"],
            stream=CONFIG["enable_stream"]
        )
        return response.choices[0].message.content
    
    def start_interview(self, candidate: Dict, position: Dict):
        """启动面试流程"""
        self.candidate = candidate
        self.position = position
        
        # 自我介绍环节
        intro_question = f"{candidate['name']}你好，请先介绍一下你自己吧！"
        print(f"[面试官] {intro_question}")
        self.dialog_history.append({"role": "assistant", "content": intro_question})
        
        # 考察简历内容
        while self.topic_count < CONFIG["max_topics"]:
            self._handle_topic_phase()
        
        # 开放性问题环节
        self._ask_open_question()
        
        # 结束面试
        closing = self._get_next_question("请说一句面试结束语")
        print(f"\n[面试官] {closing}")
        
        # 生成报告
        self.generate_report()
    
    def _handle_topic_phase(self):
        """处理单个话题问答"""
        # 选择新话题
        self.current_topic = random.choice(CONFIG["topic_prompts"])
        self.dialog_history.append({
            "role": "system", 
            "content": f"当前考察主题：{self.current_topic}"
        })
        
        # 话题引导问题
        question = self._get_next_question(self.current_topic)
        print(f"\n[面试官] {question}")
        self.dialog_history.append({"role": "assistant", "content": question})
        
        # 话题追问循环
        self.round_counter = 0
        while self.round_counter < CONFIG["max_rounds_per_topic"]:
            answer = input("[候选人] ").strip()
            self.dialog_history.append({"role": "user", "content": answer})
            
            # 生成追问或切换话题
            if self.round_counter < CONFIG["max_rounds_per_topic"] - 1:
                follow_up = self._get_next_question(answer)
                print(f"\n[面试官] {follow_up}")
                self.dialog_history.append({"role": "assistant", "content": follow_up})
            
            self.round_counter += 1
        
        self.topic_count += 1
    
    def _ask_open_question(self):
        """提出开放性问题"""
        question = self._get_next_question(CONFIG["open_question_prompt"])
        print(f"\n[面试官] {question}")
        self.dialog_history.append({"role": "assistant", "content": question})
        answer = input("[候选人] ").strip()
        self.dialog_history.append({"role": "user", "content": answer})
    
    def generate_report(self):
        """生成评估报告"""
        report_prompt = f'''基于以下对话历史，生成JSON格式的评估报告：
        {json.dumps(self.dialog_history, ensure_ascii=False)}
        
        报告需包含：
        1. 综合评分（百分制）
        2. 分维度评价（技术能力、项目理解、沟通表达）
        3. 具体示例分析（至少3个）
        4. 提升建议
        保持专业客观，用markdown格式输出'''
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": report_prompt}],
            temperature=0.5
        )
        print("\n=== 面试评估报告 ===")
        print(response.choices[0].message.content)

# ========== 执行面试 ==========
if __name__ == "__main__":
    interviewer = AIInterviewer()
    
    # 启动面试流程（使用示例数据）
    interviewer.start_interview(
        candidate=SAMPLE_DATA["candidate"],
        position=SAMPLE_DATA["position"]
    )