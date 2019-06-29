from lab_db import *
from utils import *
import Tag

COLUMNS = ['id', 'title', 'image', 'background',
           'score']

def get_levels(conn, columns):
    rows, error = db_get_levels(conn, columns)

    if rows is None:
        return rows, error

    objects = []
    for row in rows:
        objects.append(row_to_dictionary(row, columns.split(',')))

    return objects, error

def delete_level(conn, id):
    result, error = db_delete_level(conn, id)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Level deleted successfully."}

def get_level(conn, id):  # Get problem by ID
    level, error = db_get_level(conn, id)

    if level is None:
        return None, error

    full_problem = row_to_dictionary(level, COLUMNS)

    # 2. Now get all the tags from ProblemTag table
    bundle_problems, error = db_get_level_problems(conn, id)
    bundle_problems_array = []

    if bundle_problems is not None:
        for problem in bundle_problems:
            bundle_problems_array.append(row_to_dictionary(problem, ["bundle_id", "problem_id"]))
        full_problem["problems"] = bundle_problems_array

    return full_problem, error

def save_level(conn, level_obj):
    is_new = False
    if level_obj["id"] == -1:
        rows, error = db_get_levels(conn, "id")
        existing_ids = []
        for row in rows:
            existing_ids.append(row["id"])

        new_id = get_new_id(existing_ids)
        level_obj["id"] = new_id

        is_new = True

    if is_new:
        result, error = db_insert_level(conn, level_obj)
    else:
        result, error = db_update_level(conn, level_obj)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Problem saved successfully."}