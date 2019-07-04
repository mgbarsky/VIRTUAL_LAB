from lab_db import *
from utils import *
import Level

COLUMNS = ['id', 'title', 'language']


def get_games(conn, columns):
    rows, error = db_get_games(conn, columns)

    if rows is None:
        return rows, error

    objects = []
    for row in rows:
        objects.append(row_to_dictionary(row, columns.split(',')))

    return objects, error


def delete_game(conn, id):
    result, error = db_delete_game(conn, id)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Level deleted successfully."}


def get_game(conn, id):  # Get problem by ID
    game, error = db_get_game(conn, id)

    if game is None:
        return None, error

    full_game = row_to_dictionary(game, COLUMNS)

    # 2. Now get all the levels GameBundle table
    game_levels, error = Level.get_levels_by_game(conn, id)
    
    levels = []

    if game_levels is not None:
        for level in game_levels:
            levels.append(row_to_dictionary(level, ["id", "title"]))
        full_game["levels"] = levels

    return full_game, error


def save_game(conn, game_obj):
    is_new = False
    if game_obj["id"] == -1:
        rows, error = db_get_games(conn, "id")
        existing_ids = []
        for row in rows:
            existing_ids.append(row["id"])

        new_id = get_new_id(existing_ids)
        game_obj["id"] = new_id

        is_new = True

    if is_new:
        result, error = db_insert_game(conn, game_obj)
    else:
        result, error = db_update_game(conn, game_obj)

    if result is None:
        return {"result": error}
    else:
        return {"result": "Problem saved successfully."}