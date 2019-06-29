from lab_db import *
from utils import *

COLUMNS = ['id', 'title', 'color_code_style', 'icon_code', 'url']


def get_entities(conn):
    rows, error = db_get_entities(conn)
    objects = []

    if rows is not None:
        for row in rows:
            objects.append(
                row_to_dictionary(row, COLUMNS))

    return objects, error
