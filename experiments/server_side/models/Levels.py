from general_db import *
import random

COLUMNS = ['id', 'title', 'image', 'background', 'score']

def db_convert_row(row):
    new_obj = {}
    for col in COLUMNS:
        new_obj[col] = row[col]
    return new_obj

def db_get_levels(conn):
    sql = "SELECT * FROM Bundle;"
    rows = db_query(conn, sql)
    objects = []

    for row in rows:
        objects.append(db_convert_row(row))

    return objects

def db_get_level(conn, id):
    sql = "SELECT * FROM Bundle WHERE id = :id"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) > 0:
        return db_convert_row(rows[0])

    return None  # 404

def db_delete_level(conn, id):
    sql = "SELECT * from Bundle WHERE id = :id;"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if(len(rows) == 0):
        return False;

    sql = "DELETE * from Bundle WHERE id = :id"
    db_update(conn, sql, params)

def db_update_level(conn, id, level):
    sql = "SELECT * from Bundle WHERE id = :id;"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False

    for col in COLUMNS:
        params[col] = level.get(col, '')
    params['id'] = id

    sql = "UPDATE Student SET id = :id, title = :title, image = :image, background = :background, score = :score"
    db_update(conn, sql, params)

def db_create_level(conn, level):
    id = random.randint(1, 10000) #Ktemp
    params = {}
    for col in COLUMNS:
        params[col] = level.get(col, '')
    params['id'] = id

    sql = "INSERT INTO Bundle Values(:id, :title, :image, :background, :score)"
    db_update(conn, sql, params)
    return params