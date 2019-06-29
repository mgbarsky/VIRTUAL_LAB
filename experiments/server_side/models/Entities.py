from general_db import *

COLUMNS = ['id', 'title', 'color_code_style', 'icon_code', 'url']

def db_convert_row(row):
    new_obj = {}
    for col in COLUMNS:
        new_obj[col] = row[col]
    return new_obj

def db_get_entities(conn):
    sql = "SELECT * FROM Entity;"
    rows = db_query(conn, sql)
    objects = []

    for row in rows:
        objects.append(db_convert_row(row))

    return objects