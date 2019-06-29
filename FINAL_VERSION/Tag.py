from lab_db import *
from utils import *

COLUMNS = ['id', 'title']

def get_tags(conn):
    rows, error = db_get_tags(conn)
    objects = []

    if rows is not None:
        for row in rows:
            objects.append(
                row_to_dictionary(row, COLUMNS))

    return objects, error

def get_problem_tags(conn, problem_id):
    rows, error = db_get_problem_tags(conn, problem_id )
    print(rows)
    objects = []

    if rows is not None:
        for row in rows:
            print(row)
            objects.append(
                row_to_dictionary(row, COLUMNS))

    return objects, error