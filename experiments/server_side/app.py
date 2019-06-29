from flask import Flask, jsonify, abort, url_for, request
from general_db import db_connect
from models import Problem, User, Entities, Tag, Levels, Scores

app = Flask(__name__)
conn = None

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

'''
=======================
======= PROBLEMS ======
=======================
'''

def set_uri_problems(problem):
    problem['uri'] = url_for('get_problem', id=problem['id'], _external=False)

@app.route('/api/problems', methods=['GET'])
def get_problems():
    problems = Problem.db_get_problems(conn)
    for problem in problems:
        set_uri_problems(problem)
    return jsonify(problems)

@app.route('/api/problems/<int:id>', methods=['GET'])
def get_problem(id):
    problem = Problem.db_get_problem(conn, id)
    if problem is None:
        return abort(404)
    set_uri_problems(problem)
    return jsonify(problem)

@app.route('/api/problems', methods=['POST'])
def create_problem():
    if not request.json:
        abort(400)

    new_problem = Problem.db_create_problem(conn, request.json)
    set_uri_problems(new_problem)
    return jsonify(new_problem), 201

@app.route('/api/problems/<int:id>', methods=['DELETE'])
def delete_problem(id):
    if Problem.db_delete_problem(conn, id):
        return jsonify({"success": True})
    return abort(404)

@app.route('/api/problems/<int:id>', methods=['PUT'])
def update_problem(id):
    if not request.json:
        abort(400)

    updated_problem = Problem.db_update_problem(conn, id, request.json)
    if updated_problem is None:
        return abort(404)

    set_uri_problems(updated_problem)
    return jsonify(updated_problem)

'''
=======================
======= LEVELS ========
=======================
'''

def set_uri_levels(level):
    level['uri'] = url_for('get_level', id=level['id'], _external=False)

@app.route('/api/levels', methods=['GET'])
def get_levels():
    levels = Levels.db_get_levels(conn)
    for level in levels:
        set_uri_levels(level)
    return jsonify(levels)

@app.route('/api/levels/<int:id>', methods=['GET'])
def get_level(id):
    level = Levels.db_get_level(conn, id)
    if level is None:
        return abort(404)
    set_uri_levels(level)
    return jsonify(level)

@app.route('/api/levels', methods=['POST'])
def add_level():
    if not request.json:
        abort(400)

    new_level = Levels.db_create_level(conn, request.json)
    set_uri_levels(new_level)
    return jsonify(new_level), 201

@app.route('/api/levels/<int:id>', methods=['DELETE'])
def delete_level(id):
    if Levels.db_delete_level(conn, id):
        return jsonify({"success": True})
    return abort(404)

@app.route('/api/levels/<int:id>', methods=['PUT'])
def edit_level(id):
    if not request.json:
        abort(400)

    updated_level = Levels.db_update_level(conn, id, request.json)
    if updated_level is None:
        return abort(404)

    set_uri_levels(updated_level)
    return jsonify(updated_level)

'''
=======================
======== TAGS =========
=======================
'''

def set_uri_tags(tag):
    tag['tag'] = url_for('get_tag', id=tag['id'], _external=False)

@app.route('/api/tags', methods=['GET'])
def get_tags():
    # TODO: Implement Route
    tags = Tag.db_get_tags(conn)
    for tag in tags:
        set_uri_problems(tag)
    return jsonify(tags)

@app.route('/api/tags/<int:id>', methods=['POST'])
def get_tag(id):
    if not request.json:
        abort(400)

    new_tag = Tag.db_add_tag(conn, request.json)
    set_uri_tags(new_tag)
    return jsonify(new_tag), 201

'''
===========================
======== ENTITIES =========
===========================
'''

def set_uri_entities(entity):
    entity['uri'] = url_for('get_entities', id=entity['id'], _external=False)

@app.route('/api/entities', methods=['GET'])
def get_entities():
    entities = Entities.db_get_entities(conn)
    for entity in entities:
        set_uri_entities(entity)
    return jsonify(entities)

'''
========================
======== USERS =========
========================
'''
def set_uri_users(user):
    user['tag'] = url_for('get_user', id=user['id'], _external=False)

@app.route('/api/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.db_get_user(conn, id)
    if user is None:
        return abort(404)
    set_uri_users(user)
    return jsonify(user)

@app.route('/api/users/<int:id>', methods=['PUT'])
def edit_user(id):
    if not request.json:
        abort(400)

    updated_user = User.db_update_user(conn, id, request.json)
    if updated_user is None:
        return abort(404)

    set_uri_users(updated_user)
    return jsonify(updated_user)

@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    if User.db_delete_user(conn, id):
        return jsonify({"success": True})

    return abort(404)


@app.route('/api/users/<int:id>/<int:pid>', methods=['GET'])
def get_user_problem_data(id, pid):
    score = Scores.db_get_user_problem_data(conn, id, pid)
    if score is None:
        return abort(404)
    return jsonify(score)

@app.route('/api/users/<int:id>/<int:pid>', methods=['POST'])
def add_user_problem_data(id, pid):
    if not request.json:
        abort(400)

    new_score = Scores.db_create_user_problem_data(conn, id, pid, request.json)
    return jsonify(new_score), 201

@app.route('/api/users/<int:id>/<int:pid>', methods=['PUT'])
def edit_user_problem_data(id, pid):
    if not request.json:
        abort(400)

    updated_score = Scores.db_update_user_problem_data(conn, id, pid, request.json)
    if updated_score is None:
        return abort(404)
    return jsonify(updated_score)

@app.route('/api/users/<int:id>/<int:pid>', methods=['DELETE'])
def delete_user_problem_data(id, pid):
    if Scores.db_delete_user_problem_data(conn, id, pid):
        return jsonify({"success": True})

    return abort(404)

'''
========================
======== AUTH =========
========================
'''

# HASH AND SALT NOT IMPLEMENTED
# EXTREMELY UNSAFE ---- UPDATE LATER

@app.route('/register', methods=['POST'])
def add_user():
    if not request.json:
        abort(400)

    new_user = User.db_create_user(conn, request.json)
    set_uri_users(new_user)
    return jsonify(new_user), 201


if __name__ == '__main__':
    conn = db_connect()
    app.run(port=8000)