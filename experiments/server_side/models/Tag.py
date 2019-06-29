from general_db import *
import random

COLUMNS = ['id', 'title']

def db_convert_row(row):
    new_obj = {}
    for col in COLUMNS:
        new_obj[col] = row[col]
    return new_obj


def db_get_tags(conn):
    sql = "SELECT * FROM Tag;"
    rows = db_query(conn, sql)
    objects = []

    for row in rows:
        objects.append(db_convert_row(row))

    return objects

def db_add_tag(conn, tag):
    id = random.randint(1, 10000)  # Ktemp
    params = {}
    for col in COLUMS:
        params[col] = tag.get(col, '')
    params['id'] = id

    sql = "INSERT INTO Tag Values(:id, :title)"
    db_update(conn, sql, params)

    return params