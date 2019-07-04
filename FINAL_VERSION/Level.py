from lab_db import *
from utils import *
import Problem

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


def get_levels_by_game(conn, game_id):
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


def get_level(conn, id):  # Get level by ID
    level, error = db_get_level(conn, id)

    if level is None:
        return None, error

    full_problem = row_to_dictionary(level, COLUMNS)

    # 2. Now get all the problems belonging to this level
    level_problems, error = Problem.get_problems_by_level(conn, id)
    problems = []

    if level_problems is not None:
        for problem in level_problems:
            problems.append(row_to_dictionary(problem, ["id", "title"]))
        full_problem["problems"] = problems

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
        return {"result": "Level saved successfully."}