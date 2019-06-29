from general_db import *
import random

COLUMNS = ["id", "title", "comments", "problem_type", "weight", "instructions",
"starter_code", "solution"]

def db_convert_row(row):  # Convert sqlite row to JSON object
    newObject = {}
    for col in COLUMNS:
        newObject[col] = row[col]
    return newObject

def db_get_problems(conn):  # Get list of all problems
    sql = "SELECT * FROM Problem;"
    rows = db_query(conn, sql)
    objects = []

    for row in rows:
        objects.append(db_convert_row(row))

    return objects

def db_get_problem(conn, id):  # Get problem by ID
    sql = "SELECT * FROM Problem WHERE id = :id"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) > 0:
        return db_convert_row(rows[0])

    return None  # 404

def db_create_problem(conn, problem):
    id = random.randint(100, 1000000)  # Temporary ID generation
    params = {}
    for col in COLUMNS:
        params[col] = problem.get(col, '')
    params['id'] = id

    sql = "INSERT INTO Problem VALUES(:id, :title, :comments, :problem_type, \
    :weight, :instructions, :starter_code, :solution)"
    db_update(conn, sql, params)

    return params

def db_delete_problem(conn, id):
    sql = "SELECT * FROM Problem WHERE id = :id"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False  # 404

    sql = "DELETE FROM Problem WHERE id = :id"
    db_update(conn, sql, params)

def db_update_problem(conn, id, problem):
    sql = "SELECT * FROM Problem WHERE id = :id"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False  # 404

    for col in COLUMNS:
        params[col] = problem.get(col, '')
    params['id'] = id

    sql = "UPDATE Problem SET title = :title, comments = :comments, \
    problem_type = :problem_type, weight = :weight, \
    instructions = :instructions, starter_code = :starter_code, \
    solution = :solution WHERE id = :id"
    db_update(conn, sql, params)

    return params