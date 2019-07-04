"""
Application-specific database operations.
All sql statements have to be defined here - to avoid
changing models in case we need to adjust sql
to a specific DBMS

All get functions here return a tuple:
first element of the tuple is a result,
second - error message if error occurred.

All save/delete functions return result, error
Here result is whatever is returned by DB driver.
We assume that in case of failure result is None 
- but that has to be tested. (TBD)
"""
from general_db import *


def db_get_entities(conn):
    error = ""
    sql = "SELECT * FROM Entity;"
    rows, error = db_query(conn, sql)
    if rows is None:
        error = "Error while loading entities"
    return rows, error


def db_get_problems(conn, columns):  # Get list of all problems with specified columns
    sql = "SELECT " + columns + " FROM Problem;"
    rows, error = db_query(conn, sql)
    if rows is None:
        error = "Error while loading problems"
    return rows, error


def db_get_problem(con, id):  # Get problem by ID
    sql = "SELECT * FROM Problem WHERE id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None: # something went wrong with the database
        return None, error
    if len(rows) == 0:
        error = "Problem id {} not found.".format(id) # database error
        return None, error
    return rows[0], error


def db_insert_problem(conn, problem_obj):
    # there are inserts into multiple tables
    # so it has to be a single transaction

    # prepare sql queries and params
    sqls = []
    param_lists = []

    # first - update problem entity itself
    sql_problem = "INSERT INTO Problem " \
        "VALUES(:id, :title, :comments, :type, "\
        ":weight, :instructions, :starter_code, :solution)"
    sqls.append(sql_problem)
    param_lists.append(problem_obj)

    # update tags table if there were new tags
    if "new_tags" in problem_obj:
        new_tags = problem_obj["new_tags"]
        for tag in new_tags:
            sql_new_tag = "INSERT INTO Tag VALUES(:id, :title);"
            new_tag_params = {"id":tag["id"],
                              "title":tag["title"]}
            sqls.append(sql_new_tag)
            param_lists.append(new_tag_params)

    # insert tags for this problem into ProblemTag table
    problem_tags = problem_obj["tags"]
    for tag in problem_tags:
        sql_problem_tag = "INSERT INTO ProblemTag " \
                          "VALUES(:problem_id, :tag_id);"
        problem_tag_params = {"problem_id":problem_obj["id"],
                              "tag_id":tag["id"]}
        sqls.append(sql_problem_tag)
        param_lists.append(problem_tag_params)

    # insert tests into Test table
    tests = problem_obj["tests"]
    for test in tests:
        sql_test = "INSERT INTO Test " \
                   "VALUES(:problem_id, :test_id," \
                   ":test_code, :test_output);"
        test_params = {"problem_id": problem_obj["id"],
                       "test_id": test["id"],
                       "test_code": test["test_code"],
                       "test_output": test["test_output"]}
        sqls.append(sql_test)
        param_lists.append(test_params)

    # do all these updates as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to update problem: database error"

    return result, error


def db_delete_problem(conn, id):
    sqls = []
    param_lists = []
    
    # delete problem tags
    tag_sql = "DELETE FROM ProblemTag WHERE problem_id = :problem_id"
    tag_params = {'problem_id': id}
    sqls.append(tag_sql)
    param_lists.append(tag_params)

    # delete tests
    test_sql = "DELETE FROM Test WHERE problem_id = :problem_id"
    test_params = {'problem_id': id}
    sqls.append(test_sql)
    param_lists.append(test_params)

    # delete problem itself
    sql = "DELETE FROM Problem WHERE id = :id"
    params = {'id': id}

    sqls.append(sql)
    param_lists.append(params)

    # do all these deletes as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to delete problem: database error"

    return result, error


def db_update_problem(conn, problem_obj):
    # call delete
    result, error = db_delete_problem(conn, problem_obj["id"])
    if result is None:
        return None, "Failed to update(delete) problem: database error"

    # call new
    result, error = db_insert_problem(conn, problem_obj)
    if result is None:
        return None, "Failed to update problem: database error"

    return result, error


def db_get_tags(conn):
    error = ""
    sql = "SELECT * FROM Tag;"
    rows = db_query(conn, sql)
    if rows is None:
        error = "Error while reading Tags"
    return rows, error


def db_get_problem_tags(conn, problem_id):
    error = ""
    sql = "SELECT pt.tag_id as id, t.title as title " \
          "FROM Problem p " \
          "JOIN ProblemTag pt JOIN Tag t " \
          "WHERE pt.problem_id = :problem_id;"

    params = {'problem_id': problem_id};
    rows, error = db_query(conn, sql, params)
    
    if rows is None:
        error = "Error while reading Tags for problem {}".format(problem_id)
    return rows, error


def db_get_tests(conn, problem_id):
    error = ""
    sql = "SELECT test_id, test_code, test_output " \
          "FROM Test WHERE problem_id = :problem_id " \
          "ORDER BY test_id;"
    params = {'problem_id': problem_id};
    rows, error = db_query(conn, sql, params)
    if rows is None:
        error = "Error while reading tests for problem {}".format(problem_id)
    return rows, error


def db_get_levels(conn, columns):  # Get list of all levels with specified columns
    sql = "SELECT " + columns + " FROM Bundle;"
    rows, error = db_query(conn, sql)
    if rows is None:
        error = "Error while loading problems"
    return rows, error

def db_get_level(con, id):  # Get level by ID
    sql = "SELECT * FROM Bundle WHERE id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None: # something went wrong with the database
        return None, error
    if len(rows) == 0:
        error = "Level id {} not found.".format(id) # database error
        return None, error
    return rows[0], error

def db_get_level_problems(con, id):
    sql = "SELECT p.id as id, p.title as title " \
          "FROM BundleProblem bp, Problem p " \
          "WHERE p.id = bp.problem_id AND bundle_id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None:
        return None, error

    return rows, error

def db_delete_level(conn, id):
    sqls = []
    param_lists = []

    # delete tests
    b_sql = "DELETE FROM BundleProblem WHERE bundle_id = :bundle_id"
    test_params = {'bundle_id': id}
    sqls.append(b_sql)
    param_lists.append(test_params)

    # delete problem itself
    sql = "DELETE FROM Bundle WHERE id = :id"
    params = {'id': id}

    sqls.append(sql)
    param_lists.append(params)

    # do all these deletes as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to delete level: database error"

    return result, error

def db_update_level(conn, level_obj):
    # call delete
    result, error = db_delete_level(conn, level_obj["id"])
    if result is None:
        return None, "Failed to update(delete) level: database error"

    # call new
    result, error = db_insert_level(conn, level_obj)
    if result is None:
        return None, "Failed to update level: database error"

    return result, error

def db_insert_level(conn, level_obj):
    # there are inserts into multiple tables
    # so it has to be a single transaction

    # prepare sql queries and params
    sqls = []
    param_lists = []

    # first - update problem entity itself
    sql_problem = "INSERT INTO Bundle " \
        "VALUES(:id, :title, :image, :background, :score)"

    sqls.append(sql_problem)
    param_lists.append(level_obj)

    # insert problems for this problem into BundleProblem table
    if "problemsUsed" in level_obj:
        bundle_problems = level_obj["problemsUsed"]

        for problem in bundle_problems:
            #problem["bundle_id"] =
            sql_new_tag = "INSERT INTO BundleProblem VALUES(:bundle_id, :problem_id)"
            new_tag_params = {"bundle_id": level_obj['id'], "problem_id": problem['id']}
            sqls.append(sql_new_tag)
            param_lists.append(new_tag_params)


    # do all these updates as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to update problem: database error"

    return result, error



def db_get_students(conn, columns):  # Get list of all students with specified columns
    sql = "SELECT " + columns + " FROM Student;"
    rows, error = db_query(conn, sql)
    if rows is None:
        error = "Error while loading problems"
    return rows, error

def db_get_student(con, id):  # Get student by ID
    sql = "SELECT * FROM Student WHERE id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None:  # something went wrong with the database
        return None, error
    if len(rows) == 0:
        error = "Student id {} not found.".format(id)  # database error
        return None, error
    return rows[0], error

def db_get_student_courses(con, id):
    sql = "SELECT cs.course_id as id, c.title as title " \
          "FROM CourseStudent cs, Course c " \
          "WHERE c.id = cs.course_id AND student_id = :student_id"
    params = {'student_id': id}
    rows, error = db_query(con, sql, params)
    if rows is None:
        return None, error

    if len(rows) == 0:
        error = "StudentCourse id {} not found.".format(id)
        return None, error

    return rows, error

def db_delete_student(conn, id):
    sqls = []
    param_lists = []

    # delete course
    b_sql = "DELETE FROM CourseStudent WHERE student_id = :student_id"
    test_params = {'student_id': id}
    sqls.append(b_sql)
    param_lists.append(test_params)

    # delete student itself
    sql = "DELETE FROM Student WHERE id = :id"
    params = {'id': id}

    sqls.append(sql)
    param_lists.append(params)

    # do all these deletes as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to delete student: database error"

    return result, error

def db_update_student(conn, student_obj):
    # call delete
    result, error = db_delete_student(conn, student_obj["id"])
    if result is None:
        return None, "Failed to update student: database error"

    # call new
    result, error = db_insert_student(conn, student_obj)
    if result is None:
        return None, "Failed to update student: database error"

    return result, error

def db_insert_student(conn, student_obj):
    # there are inserts into multiple tables
    # so it has to be a single transaction

    # prepare sql queries and params
    sqls = []
    param_lists = []

    # first - update student entity itself
    sql_student = "INSERT INTO Student " \
        "VALUES(:id, :email, :screen_name, :password, :first_name, " \
                  ":last_name, :image, :dob, :background)"

    sqls.append(sql_student)
    param_lists.append(student_obj)

    print("inside db_insert_student")
    print(student_obj)
    # insert courseid for this student into CourseStudent table
    sql_new_course = "INSERT INTO CourseStudent VALUES(:course_id, :student_id)"
    new_course_params = {"course_id": student_obj['course_id'], "student_id": student_obj['id']}
    sqls.append(sql_new_course)
    param_lists.append(new_course_params)

    # do all these updates as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to update student: database error"

    return result, error


def db_insert_student_sol(conn, student_obj):
    # there are inserts into multiple tables
    # so it has to be a single transaction

    # prepare sql queries and params
    sqls = []
    param_lists = []

    # first - update student entity itself
    sql_student = "INSERT INTO StudentProblem " \
        "VALUES(:student_id, :bundle_id, :problem_id, :time_minutes, :solution, " \
                  ":grade)"

    sqls.append(sql_student)
    param_lists.append(student_obj)

    print("inside db_insert_student")
    print(student_obj)

    # do all these updates as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to update student: database error"

    return result, error

def db_check_students(conn, student_obj):
    sql = "SELECT * FROM Student WHERE email = :email AND password = :password"
    params = {'email': student_obj['email'], 'password': student_obj['password']}
    rows, error = db_query(conn, sql, params)
    if rows is None:  # something went wrong with the database
        return None, error
    if len(rows) == 0:
        error = "Email and Password not matched"  # no student with that email and password found
        return None, error
    return rows[0], error

def db_get_games(conn, columns):  # Get list of all levels with specified columns
    sql = "SELECT " + columns + " FROM Course;"
    rows, error = db_query(conn, sql)
    if rows is None:
        error = "Error while loading games."
    return rows, error

def db_get_game(con, id):  # Get level by ID
    sql = "SELECT * FROM Course WHERE id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None: # something went wrong with the database
        return None, error
    if len(rows) == 0:
        error = "Game id {} not found.".format(id) # database error
        return None, error
    return rows[0], error

def db_get_game_bundles(con, id):
    sql = "SELECT b.id as id, b.title as title FROM CourseBundle cb, Bundle b " \
          "WHERE b.id = cb.bundle_id AND course_id = :id"
    params = {'id': id}
    rows, error = db_query(con, sql, params)
    if rows is None:
        return None, error


    return rows, error

def db_delete_game(conn, id):
    sqls = []
    param_lists = []

    # delete tests
    b_sql = "DELETE FROM CourseBundle WHERE course_id = :course_id"
    test_params = {'course_id': id}
    sqls.append(b_sql)
    param_lists.append(test_params)

    # delete problem itself
    sql = "DELETE FROM Course WHERE id = :id"
    params = {'id': id}

    sqls.append(sql)
    param_lists.append(params)

    # do all these deletes as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to delete level: database error"

    return result, error


def db_update_game(conn, level_obj):
    # call delete
    result, error = db_delete_game(conn, level_obj["id"])
    if result is None:
        return None, "Failed to update game (delete): database error"

    # call new
    result, error = db_insert_game(conn, level_obj)
    if result is None:
        return None, "Failed to update game: database error"

    return result, error

def db_insert_game(conn, course_obj):
    # there are inserts into multiple tables
    # so it has to be a single transaction

    # prepare sql queries and params
    sqls = []
    param_lists = []

    # first - update problem entity itself
    sql_problem = "INSERT INTO Course " \
        "VALUES(:id, :title, :language)"

    sqls.append(sql_problem)
    param_lists.append(course_obj)

    # insert problems for this problem into BundleProblem table
    if "levelsUsed" in course_obj:
        course_bundles = course_obj["levelsUsed"]

        for level in course_bundles:
            sql_new_tag = "INSERT INTO CourseBundle VALUES(:course_id, :bundle_id)"
            new_tag_params = {"course_id": course_obj['id'], "bundle_id": level['id']}
            sqls.append(sql_new_tag)
            param_lists.append(new_tag_params)


    # do all these updates as a single transaction
    result, error = db_transaction_update(conn, sqls, param_lists)
    if result is None:
        return None, "Failed to update problem: database error"

    return result, error