from lab_db import *

def get_new_id(id_list): #returns next avilable id
    if len(id_list)==0:
        return 0

    id_list.sort()

    for i in range(len(id_list) - 1):
        if id_list[i+1] > id_list[i] + 1:
            return id_list[i] + 1

    return (id_list[len(id_list)-1]+1)


def row_to_dictionary(row, columns):
    d = {}
    for col in columns:
        d[col] = row[col]
    return d

def get_new_level_id(conn):
    i = 0
    re = -1
    while(1):
        level, err = db_get_level(conn, i)
        if level is None:
            re = i
            break
        i = i + 1
    return re