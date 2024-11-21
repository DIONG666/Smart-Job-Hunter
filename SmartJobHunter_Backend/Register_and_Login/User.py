import sqlite3
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

users = Blueprint('users', __name__)

# ljl:创建账户信息数据库文件,把这个db文件名字改了
DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@users.route('/users/register-with-account', methods=['POST'])
def register_with_account():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    # ljl:检验代码是否正确,此处是检查账户是否已经存在
    cur.execute('''CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username nchar(5),
                    email varchar(30),
                    password varchar(20),
                    phone varchar(20),
                    first_login boolean default true,
                    identity char(10) check (identity in('student','firm'))
                )''')
    cur.execute('SELECT * FROM user WHERE username = ? OR email = ?', (data['username'], data['email']))
    user = cur.fetchone()
    if user:
        conn.close()
        return jsonify({'message': '用户已存在'}), 409
    hashed_password = generate_password_hash(data['password'])
    # ljl:检验代码是否正确,此处是插入账户信息
    cur.execute('INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
                (data['username'], data['email'], hashed_password))
    conn.commit()
    conn.close()
    return jsonify({'message': '用户注册成功'}), 201


@users.route('/users/register-with-sms', methods=['POST'])
def register_with_sms():
    data = request.get_json()
    # 假设validate_sms_code已实现短信验证码的正确性验证
    if not validate_sms_code(data['phone'], data['verificationCode']):
        return jsonify({'message': '验证码错误'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # ljl:检验代码是否正确,此处是检查账户是否已经存在
    cur.execute('SELECT * FROM user WHERE username = ? OR email = ? OR phone = ?',
                (data['username'], data['email'], data['phone']))
    user = cur.fetchone()
    if user:
        conn.close()
        return jsonify({'message': '用户已存在'}), 409
    # 此处假定短信注册不设置密码
    # ljl:检验代码是否正确,此处是插入账户信息
    cur.execute('INSERT INTO user (username, email, phone) VALUES (?, ?, ?)',
                (data['username'], data['email'], data['phone']))
    conn.commit()
    conn.close()
    return jsonify({'message': '用户注册成功'}), 201


@users.route('/users/login-with-account', methods=['POST'])
def login_with_account():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    # ljl:检验代码是否正确,此处是查找账户信息
    cur.execute('SELECT * FROM user WHERE username = ? OR email = ?', (data['login'], data['login']))
    user = cur.fetchone()
    conn.close()
    if user and check_password_hash(user['password'], data['password']):
        # 用户验证成功
        return jsonify({
            'message': '登录成功',
            'user_id': user['id'],  # 返回用户ID
            'first_login': user['first_login'],
            'identity': user['identity']
        }), 200
    else:
        # 用户验证失败
        return jsonify({'message': '用户名/邮箱或密码错误'}), 404


@users.route('/users/login-with-sms', methods=['POST'])
def login_with_sms():
    data = request.get_json()
    if not validate_sms_code(data['phone'], data['verificationCode']):
        return jsonify({'message': '验证码错误'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # ljl:检验代码是否正确,此处是查找账户信息
    cur.execute('SELECT * FROM user WHERE phone = ?', (data['phone'],))
    user = cur.fetchone()
    conn.close()
    if user:
        # 手机号验证成功
        return jsonify({
            'message': '登录成功',
            'user_id': user['id'],  # 返回用户ID
            'first_login': user['first_login'],
            'identity': user['identity']
        }), 200
    else:
        # 手机号未注册
        return jsonify({'message': '手机号未注册'}), 404


def validate_sms_code(phone, code):
    # 验证码校验逻辑（需实现）
    return True
