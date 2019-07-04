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

