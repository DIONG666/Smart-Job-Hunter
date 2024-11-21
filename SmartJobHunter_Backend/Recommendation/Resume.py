from flask import Flask, request, jsonify, Blueprint, send_from_directory
import sqlite3
import os

resumes = Blueprint('resumes', __name__)

DATABASE = 'Information.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # 方便后面将行数据转化为字典
    return conn


@resumes.route('/resumes/view/<int:student_id>', methods=['GET'])
def view_resume(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 从学生信息数据库中查询求职者的简历PDF文件路径
    cursor.execute('''
        SELECT resume_path
        FROM student_info
        WHERE id = ?
    ''', (student_id,))
    resume = cursor.fetchone()
    # print(resume)
    # print(resume['resume_path'])

    if resume and resume['resume_path']:
        resume_path = resume['resume_path']
        # 返回文件路径，或使用send_from_directory直接发送文件
        return jsonify({'resume_url': resume_path}), 200
    else:
        return jsonify({'message': '简历未找到'}), 404
