import re


def parse_salary(salary_str):
    """解析薪资字符串，返回薪资范围的最小值和最大值。"""
    # 移除最后一个'K'之后的所有内容
    salary_str = re.sub(r'k[^k]*$', 'k', salary_str, flags=re.IGNORECASE)

    # 将字符串转换为小写以统一处理大写和小写的'K'
    parts = salary_str.lower().replace('k', '').split('-')

    if len(parts) == 2:

        # 使用正则表达式提取字符串中的数字部分
        min_salary_numbers = re.findall(r'\d+', parts[0].strip())
        max_salary_numbers = re.findall(r'\d+', parts[1].strip())
        # 确保提取到的是数字并进行转换
        if min_salary_numbers:
            min_salary = int(''.join(min_salary_numbers)) *1000  # 正确处理最小薪资
        else:
            min_salary = 0
        if max_salary_numbers:
            max_salary = int(''.join(max_salary_numbers)) *1000   # 正确处理最大薪资
        else:
            max_salary = 0
    else:
        # 对于单一值的情况，只需提取一次数字

        salary_numbers = re.findall(r'\d+', parts[0].strip())
        if salary_numbers:
            min_salary = max_salary = int(''.join(salary_numbers))*1000
        else:
            min_salary = max_salary = 0
    return min_salary, max_salary



# 重新尝试执行函数
print(parse_salary("15-30K"))