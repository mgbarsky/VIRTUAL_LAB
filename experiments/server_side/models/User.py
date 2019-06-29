from general_db import *
import random

COLUMNS = ['id', 'email', 'screen_name', 'password', 'first_name', 'last_name', 'image', 'dob', 'background']

def db_convert_row(row):
    new_obj = {}
    for col in COLUMNS:
        new_obj[col] = row[col]
    return new_obj

def db_get_user(conn, id):
    sql = "SELECT * from Student WHERE id = :id;"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) > 0:
        return db_convert_row(rows[0])

    return None

def db_delete_user(conn, id):
    sql = "SELECT * from Student WHERE id = :id;"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if(len(rows) == 0):
        return False;

    sql = "DELETE * from Student WHERE id = :id"
    db_update(conn, sql, params)

def db_update_user(conn, id, user):
    sql = "SELECT * from Student WHERE id = :id;"
    params = {'id': id}
    rows = db_query(conn, sql, params)

    if len(rows) == 0:
        return False

    for col in COLUMNS:
        params[col] = user.get(col, '')
    params['id'] = id

    sql = "UPDATE Student SET id = :id, email = :email, screen_name = :screen_name, password = :password,\
     first_name = :first_name, last_name = :last_name, image = :image, dob = :dob, background = :background"

    db_update(conn, sql, params)

def db_create_user(conn, user):
    id = 1
    params = {}
    for col in COLUMS:
        params[col] = user.get(col, '')
    params['id'] = id

    sql = "INSERT INTO Student Values(:id, :email, :screen_name, :password, :first_name, :last_name, :image, :dob, :background)"
    db_update(conn, sql, params)

    return params