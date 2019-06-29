# !/usr/bin/python
# -*- coding: utf-8 -*-
# conn.execute(), executemany() and executescript()
import sqlite3 as lite
import sys

"""
This module implements general 
database operations on database tier (sqlite).
It can be replaced with another dbms.
The operations include:
    connect
    query
    modification (update)
    converting a database row to a dictionary object
    assigning new object id (small next available integer)
    transactional update - executed as an atomic operation
    
All functions return None on error
"""

SQLITE_DB = 'lab.db'


def db_connect():
    con = None
    try:
        con = lite.connect(SQLITE_DB, check_same_thread=False)
        con.isolation_level = None # you have to set this to allow custom transactions

    except lite.Error as e:
        if con:
            con.rollback()
        print("Connection error: {0}".format(e))
        sys.exit(1)

    return con


def db_query(con, sql, params=None):
    if not con:
        print("Not connected to the database")
        return None,"Not connected to the database"

    rows = None
    error = ""
    try:
        con.row_factory = lite.Row

        cur = con.cursor()
        if params:
            cur.execute(sql, params)
        else:
            cur.execute(sql)

        rows = cur.fetchall()

    except lite.Error as e:
        print("Connection error: {0}".format(e))
        error = "Database error"
        rows = None

    return rows, error


def db_update(con, sql, params=None):
    result = None
    try:
        cur = con.cursor()
        result = cur.execute(sql, params)
        con.commit()

    except lite.Error as e:
        if con:
            con.rollback()

        print("Update failed: {0}".format(e))
        result = None

    return result


def db_transaction_update(conn, sqls, param_lists):
    """
    :param sqls: list of sql statements to be executed as a single transaction
    :param param_lists: corresponding list of parameters for each statement
    :return: result of commit - None if error occurred
    """
    result = None
    error = ""
    cur = conn.cursor()
    cur.execute("begin")
    try:
        for i in range(len(sqls)):
            print(sqls[i])
            print(param_lists[i])
            cur.execute(sqls[i], param_lists[i])
        result = cur.execute("commit")

    except lite.Error as e:
        cur.execute("rollback")
        print("Transaction failed: {0}".format(e))
        error = "Transaction failed: {0}".format(e)
        return None, error

    return result, error









