from lab_db import *
from utils import *

COLUMNS = ['id', 'title']


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

    # 2. Now get all the tags from ProblemTag table
    game_bundles, error = db_get_game_bundles(conn, id)
    game_bundles_array = []

    if game_bundles is not None:
        for bundle in game_bundles:
            game_bundles_array.append(row_to_dictionary(bundle, ["course_schedule_id", "bundle_schedule_id"]))
        full_game["levels"] = game_bundles_array

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