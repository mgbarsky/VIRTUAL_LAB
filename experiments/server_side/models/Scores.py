from general_db import *
import random

COLUMNS = ['student_id', 'bundle_schedule_id', 'problem_id', 'time_minutes', 'total_chars', 'total_lines', 'grade']
def db_convert_row(row):
    new_obj = {}
    for col in COLUMNS:
        new_obj[col] = row[col]
    return new_obj

def db_get_user_problem_data(conn, id, pid):
    sql = "SELECT * from StudentProblem WHERE student_id = :student_id AND problem_id = :problem_id;"
    params = {'student_id': id, 'problem_id': pid}
    rows = db_query(conn, sql, params)

    if len(rows) > 0:
        return db_convert_row(rows[0])

    return None

def db_delete_user_problem_data(conn, id, pid):
    sql = "SELECT * from StudentProblem WHERE student_id = :student_id AND problem_id = :problem_id;"
    params = {'student_id': id, 'problem_id': pid}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False  # 404

    sql = "DELETE FROM StudentProblem WHERE id = :id AND problem_id = :problem_id"
    db_update(conn, sql, params)

def db_update_user_problem_data(conn, id, pid, user_problem):
    sql = "SELECT * from StudentProblem WHERE student_id = :student_id AND problem_id = :problem_id;"
    params = {'student_id': id, 'problem_id': pid}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False  # 404

    for col in COLUMNS:
        params[col] = user_problem.get(col, '')
    params['student_id'] = id
    params['problem_id'] = pid

    sql = "UPDATE StudentProblem SET student_id = :student_id, bundle_schedule_id = :bundle_schedule_id, problem_id = :problem_id \
          time_minutes = :time_minutes, total_chars = :total_chars, total_lines = :total_lines, grade = :grade"
    db_update(conn, sql, params)
    return params

def db_create_user_problem_data(conn, id, pid, user_problem):
    id = random.randint(1, 10000)  # Ktemp
    params = {}
    for col in COLUMNS:
        params[col] = user_problem.get(col, '')
    params['student_id'] = id
    params['problem_id'] = pid

    sql = "INSERT INTO StudentProblem VALUES(:student_id, :bundle_schedule_id, :problem_id, :time_minutes, :total_chars, \
          :total_lines, :grade"

    db_update(conn, sql, params)
    return params