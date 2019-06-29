from lab_db import *
from utils import *

COLUMNS = ['test_id', 'test_code', 'test_output']

def get_tests(conn, problem_id):
    rows, error = db_get_tests(conn, problem_id)
    objects = []

    if rows is not None:
        for row in rows:
            objects.append(
                row_to_dictionary(row, COLUMNS))

    return objects, error

def get_problem_tags(conn, problem_id):
    rows, error = db_get_problem_tags(conn)
    objects = []

    if rows is not None:
        for row in rows:
            objects.append(
                row_to_dictionary(row, COLUMNS))

    return objects, error