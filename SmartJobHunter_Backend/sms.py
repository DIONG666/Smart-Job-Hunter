import sqlite3
from flask import Blueprint, request, jsonify

sms = Blueprint('sms', __name__)

# ljl:创建账户信息数据库文件,把这个db文件名字改了
DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@sms.route('/sms/send', methods=['POST'])
def send_sms():
    data = request.get_json()
    phone = data['phone']
    # 此处应实现手机号格式的验证，这里仅为示例
    if not validate_phone_number(phone):
        return jsonify({'message': '手机号格式错误'}), 400

    send_sms_code_to_phone(phone)

    # 假设验证码发送成功
    return jsonify({'message': '验证码发送成功'}), 200


def validate_phone_number(phone):
    if len(phone) == 11 and phone.startswith('1') and phone.isdigit():
        return True
    return False


# 假设的发送短信验证码函数，需要根据实际使用的短信服务提供商API来实现
def send_sms_code_to_phone(phone):
    # Sane:尝试搞一下
    # 这里应该包含调用短信服务商API的代码
    # 例如使用requests库发送HTTP请求
    pass
