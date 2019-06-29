from lab_db import *
from utils import *
import Tag

COLUMNS = ['id', 'email', 'screen_name', 'password', 'first_name',
           'last_name', 'image', 'dob', 'background']

def get_students(conn, columns):

    rows, error = db_get_students(conn, columns)

    if rows is None:
        return rows, error

    objects = []
    for row in rows:
        objects.append(row_to_dictionary(row, columns.split(',')))

    return objects, error

def delete_student(conn, id):
    result, error = db_delete_student(conn, id)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Student deleted successfully."}

def get_student(conn, id):  # Get problem by ID
    student, error = db_get_student(conn, id)

    if student is None:
        return None, error

    full_student = row_to_dictionary(student, COLUMNS)

    # 2. Now get all the courses from CourseStudent table
    student_courses, error = db_get_student_courses(conn, id)
    student_courses_array = []

    if student_courses is not None:
        for course in student_courses:
            student_courses_array.append(row_to_dictionary(course, ["id", "title"]))
        full_student["courses"] = student_courses_array

    return full_student, error

def save_student(conn, student_obj):
    is_new = False
    if student_obj["id"] == -1:
        rows, error = db_get_students(conn, "id")
        existing_ids = []
        for row in rows:
            existing_ids.append(row["id"])

        new_id = get_new_id(existing_ids)
        student_obj["id"] = new_id

        is_new = True

    if is_new:
        result, error = db_insert_student(conn, student_obj)
    else:
        result, error = db_update_student(conn, student_obj)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Student saved successfully."}

def save_student_sol(conn, student_obj):
    result, error = db_insert_student_sol(conn, student_obj)
    if result is None:
        return {"result": error}
    else:
        return {"result": "Student solution saved successfully."}

def check_students(conn, student_obj):
    result, error = db_check_students(conn, student_obj)
    if result is None:
        return {"result": error}
    else:
        full_student = row_to_dictionary(result, COLUMNS)
        return {"result": "success","student_data": full_student}