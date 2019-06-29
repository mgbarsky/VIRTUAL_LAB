from lab_db import *
from utils import *
import Tag, Test

COLUMNS = ['id', 'title', 'comments', 'type',
           'weight', 'instructions', 'starter_code',
           'solution']


# get list of all problems with specified columns
def get_problems(conn, columns):
    rows, error = db_get_problems(conn, columns)

    if rows is None:
        return rows, error

    objects = []
    for row in rows:
        objects.append(row_to_dictionary(row, columns.split(',')))

    print(objects)
    return objects, error


def get_problem(conn, id):  # Get problem by ID
    # construct the full problem object
    # 1. First get all the fields from the Problem table
    problem, error = db_get_problem(conn, id)

    if problem is None:
        return None, error

    full_problem = row_to_dictionary(problem, COLUMNS)

    # 2. Now get all the tags from ProblemTag table
    problem_tags = Tag.get_problem_tags(conn, id)
    if problem_tags is None:
        return None, error
    tags = []
    for tag in tags:
        tags.append(row_to_dictionary(tag, ["id", "title"]))

    full_problem["tags"] = tags

    # 3. Finally get all the tests from the Test table
    problem_tests = Test.get_tests(conn, id)
    if problem_tests is None:
        return None, error
    tests = []
    for test in tests:
        tests.append(row_to_dictionary(test, ["test_id", "test_code", "test_output"]))

    full_problem["tests"] = tests
    return full_problem, error


def save_problem(conn, problem_obj):
    is_new = False
    if problem_obj["id"] == -1:
        rows, error = db_get_problems(conn, "id")
        existing_ids = []
        for row in rows:
            existing_ids.append(row["id"])

        new_id = get_new_id(existing_ids)
        problem_obj["id"] = new_id
        is_new = True

    if is_new:
        result, error = db_insert_problem(conn, problem_obj)
    else:
        result, error = db_update_problem(conn, problem_obj)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Problem saved successfully."}


def delete_problem(conn, id):
    result, error = db_delete_problem(conn, id)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Problem deleted successfully."}