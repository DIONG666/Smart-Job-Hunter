import requests
import json

# 测试环境的基础URL
BASE_URL = 'http://127.0.0.1:5000'  # 示例IP，请根据实际后端服务地址修改


def test_register_with_account():
    """测试账户注册"""
    url = f"{BASE_URL}/users/register-with-account"
    payload = {
        "username": "DIONG1",
        "email": "1111@example.com",
        "password": "password1234"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    print("Register with account:", response.status_code, json.loads(response.text))


def test_send_sms():
    """测试发送短信验证码"""
    url = f"{BASE_URL}/sms/send"
    payload = {"phone": "18570775221"}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    print("Send SMS:", response.status_code, json.loads(response.text))


def test_register_with_sms():
    """测试短信验证码注册"""
    url = f"{BASE_URL}/users/register-with-sms"
    payload = {
        "username": "testSMSUser",
        "email": "testSMSUser@example.com",
        "phone": "1234567890",
        "verificationCode": "1234"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    print("Register with SMS:", response.status_code, json.loads(response.text))


def test_login_with_account():
    """测试账号密码登录"""
    url = f"{BASE_URL}/users/login-with-account"
    payload = {
        "login": "1111@example.com",
        "password": "password1234"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    print("Login with account:", response.status_code, json.loads(response.text))


def test_login_with_sms():
    """测试短信验证码登录"""
    url = f"{BASE_URL}/users/login-with-sms"
    payload = {
        "phone": "1234567890",
        "verificationCode": "1234"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    print("Login with SMS:", response.status_code, json.loads(response.text))


def test_update_identity():
    """测试更新用户身份"""
    url = f"{BASE_URL}/users/update-identity"
    payload = {
        "userId": "3",  # 假设的用户ID，实际使用时需要替换为真实的用户ID
        "identity": "firm"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.put(url, json=payload, headers=headers)
    print("Update identity:", response.status_code, json.loads(response.text))


def test_resume_upload():
    """测试简历上传"""
    url = f"{BASE_URL}/resume/upload/1"
    files = {'file': open('凡广的简历.pdf', 'rb')}  # 假设简历文件名为resume.pdf，实际使用时需替换为真实文件
    response = requests.post(url, files=files)
    print("Resume upload:", response.status_code, json.loads(response.text))


def test_resume_info_update():
    """测试简历上传"""
    url = f"{BASE_URL}/resume/post-info/1"
    data = {
        'identity': 'student',
        'privacySetting': 0
    }
    response = requests.post(url, json=data)
    print("Resume upload:", response.status_code, json.loads(response.text))


def test_get_student_info():
    """测试获取学生补充信息"""
    url = f"{BASE_URL}/students/get-info/1"  # 假设的用户ID
    response = requests.get(url)
    print("Get student info:", response.status_code, json.loads(response.text))


def test_get_company_info():
    """测试获取学生补充信息"""
    url = f"{BASE_URL}/companies/get-info/2"  # 假设的用户ID
    response = requests.get(url)
    print("Get company info:", response.status_code, json.loads(response.text))


def test_update_student_info():
    """测试更新学生补充信息"""
    url = f"{BASE_URL}/students/update-info"
    payload = {
        "userId": 1,  # 假设的用户ID
        "name": "凡广",
        "sex": "男",
        "lowestSalary": "4000",
        "highestSalary": "7000",
        "phone": "18570662505",
        "education": "本科",
        "year": "21",
        "intention": "Java后端工程师",
        "intentionCity": "长沙",
        "email": "3166387637@qq.com",
        "profession": "计算机科学与技术",
        "educationExperience": "湖南科技大学本科",
        "internship": "湖南新航动力信息科技有限公司"
                      "1、参与项目需求分析，根据产品需求完成软件体系架构设计；"
                      "2、根据开发进度和任务分配，完成相应模块的设计、编码任务；"
                      "3、协助售后部门定位已上市软件的异常问题，负责已上市软件的维护及升级；"
                      "4、协助项目组完成软件需求文档、软件设计文档等的编写；"
                      "5、负责框架后台、客户、商机、合同、ERP、OA 事务和工作流引擎及业务组件开发实践经验基础扎实"
                      "业绩:"
                      "为公司减少了7%的成本，以及提升了4%的销售额度",
        "project": "项目架构："
                   "Haproxy+nginx+RabbitMQ+Netty+Nacos+Feign+Redis+Mysql+SpringBoot+Spring+SpringCloudAlibaba+SpringMVC+Mybatis"
                   "等;"
                   "项目描述:该项目采用 saas 架构部署,针对各种牧场等,提供一系列票务服务,具有灵活适用,高稳定,高可用,高可靠性,打通了检"
                   "        票入园系统,杜绝了入园假,漏的安全隐患.使用二维码的方式,使游客可自主检票入园,日常 qps 可到千级。"
                   "项目职责:"
                   "一、物联网验票服务："
                   "1.基于 Nacos+Feign 实现验票接口发送消息到 RabbitMQ ,进行数据报表的统计"
                   "二、采用 SSM+SpringBoot+SpringCloud+Redis 对商品服务的实现：",
        "advantage": "1. 1年 Java 开发工作经验，具备扎实的 Java 基础，有良好编码习惯；"
                     "2. 熟练使用 IDEA 开发工具，Git 等版本控制工具以及 Maven 项目管理工具；"
                     "3. 熟悉主流开源框架，如 Spring、Spring MVC、MyBatis、Spring Boot 等；"
                     "4. 熟练应用关系型数据库 MySQL ，熟练使用 Redis 非关系型数据库；"
                     "5. 熟练 Rocket MQ，Rabbit MQ 等主流消息中间件；"
                     "6.了解 Linux,Docker 常用环境搭建；"
                     "7.了解多线程原理，以及 JVM/GC 等机制；"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.put(url, json=payload, headers=headers)
    print("Update student info:", response.status_code, json.loads(response.text))


def test_create_company_info():
    url = f"{BASE_URL}/companies/create-info"
    data = {
        "userId": "2",
        "identity": "Company",
        "name": "Test Company",
        "job": "Software Engineer",
        "description": "HTML",
        "education": "Bachelor's",
        "manager": "John Doe",
        "salary": "5-7K",
        "address": "上海",
        "link": "http://example.com/job"
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=data, headers=headers)
    print("Create company info response:", response.status_code, response.json())


def test_get_recommended_jobs():
    """测试获取推荐职位列表"""
    url = f"{BASE_URL}/jobs/recommended/1"  # 假设的用户ID
    response = requests.get(url)
    print("Get recommended jobs:", response.status_code, json.loads(response.text))


def test_sort_recommended_talents():
    """测试人才推荐筛选"""
    criteria = "education"  # 示例筛选条件，可替换为skills等
    url = f"{BASE_URL}/talents/sort/2/{criteria}"
    response = requests.get(url)
    print("Sort recommended talents:", response.status_code, json.loads(response.text))


def test_sort_recommended_jobs():
    """测试职位推荐筛选"""
    criteria = "salary"  # 示例筛选条件，可替换为education, location, skills等
    url = f"{BASE_URL}/jobs/sort/1/{criteria}"
    response = requests.get(url)
    print("Sort recommended jobs:", response.status_code, json.loads(response.text))


def test_get_recommended_talents():
    """测试获取推荐职位列表"""
    url = f"{BASE_URL}/talents/recommended/2"  # 假设的用户ID
    response = requests.get(url)
    print("Get recommended talents:", response.status_code, json.loads(response.text))


def test_evaluation():
    url = f"{BASE_URL}/jobs/evaluation/1/824"  # 假设的用户ID
    response = requests.get(url)
    print("Get evaluation:", response.status_code, json.loads(response.text))


if __name__ == '__main__':
    # test_register_with_account()
    # test_send_sms()
    # test_register_with_sms()
    # test_login_with_account()
    # test_login_with_sms()
    # test_update_identity()
    # test_resume_upload()
    # test_resume_info_update()
    # test_get_student_info()
    # test_get_company_info()
    # test_update_student_info()
    test_get_recommended_jobs()
    # test_sort_recommended_jobs()
    # test_create_company_info()
    # test_get_recommended_talents()
    # test_sort_recommended_talents()
    # test_evaluation()
