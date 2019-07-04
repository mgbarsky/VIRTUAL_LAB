from flask import *
from lab_db import *
import Entity, Problem, Level, Student, Game

app = Flask(__name__, static_url_path='')
conn = None

# jsonify responses will be output with newlines, 
# spaces, and indentation for easier reading by humans. 
# Always enable in debug mode.
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


"""
===========================
======== ENTITIES =========
===========================
"""
@app.route('/api/entities', methods=['GET'])
def get_entities():
    entities, error = Entity.get_entities(conn)
    json_response = dict()
    json_response["entities"] = entities
    json_response["error"] = error
    return jsonify(json_response)


"""
===========================
======== PROBLEMS =========
===========================
"""
@app.route('/api/problems/<columns>', methods=['GET'])
def get_problems(columns):
    problems, error = Problem.get_problems(conn, columns)
    print(problems)
    d = dict()
    d["problems"] = problems
    d["error"] = error
   
    return jsonify(d)


@app.route('/api/problem/<id>', methods=['GET'])
def get_problem(id):
    print(id)
    problem, error = Problem.get_problem(conn, id)
    json_response = dict()
    json_response["problem"] = problem
    json_response["error"] = error
    return jsonify(json_response)


@app.route('/api/problem', methods=['POST', 'PUT'])
def save_problem():
    if not request.json or 'title' not in request.json:
        json_response = {"result":"Title must be specified"}
    else:
        json_response = Problem.save_problem(conn, request.json)

    return jsonify(json_response)


@app.route('/api/problem/<id>', methods=['DELETE'])
def delete_problem(id):
    json_response = Problem.delete_problem(conn, id)
    return jsonify(json_response)


"""
===========================
========= LEVELS ==========
===========================
"""
@app.route('/api/levels/<columns>', methods=['GET'])
def get_levels(columns):
    levels, error = Level.get_levels(conn, columns)
    json_response = dict()
    json_response["levels"] = levels
    json_response["error"] = error

    return jsonify(json_response)


@app.route('/api/level/<id>', methods=['GET'])
def get_level(id):
    json_response = dict()
    json_response["level"] = None
    
    level, error = Level.get_level(conn, id)
    
    if level is None:
        json_response["error"] = error
        return jsonify(json_response)

    json_response["level"] = level
    
    # also need the problems to choose from
    json_response["allProblems"] = None
    all_problems, error = Problem.get_problems(conn, "id,title")
    
    if all_problems is None:
        json_response["error"] = error
        return jsonify(json_response)
    
    json_response["allProblems"] = all_problems
    json_response["error"] = error
    return jsonify(json_response)


@app.route('/api/level', methods=['POST', 'PUT'])
def save_level():
    if not request.json or not 'title' in request.json:
        json_response = {"result": "Title must be specified!"}
    else:
        json_response = Level.save_level(conn, request.json)

    return jsonify(json_response)


@app.route('/api/level/<id>', methods=['DELETE'])
def delete_level(id):
    json_response = Level.delete_level(conn, id)

    return jsonify(json_response)


"""
===========================
========= GAMES ==========
===========================
"""
@app.route('/api/games/<columns>', methods=['GET'])
def get_games(columns):
    games, error = Game.get_games(conn, columns)
    d = {}
    d["games"] = games
    d["error"] = error

    return jsonify(d)


@app.route('/api/game/<id>', methods=['GET'])
def get_game(id):
    game, error1 = Game.get_game(conn, id)

    all_levels, error2 = Level.get_levels(conn, "id,title")
    json_response = dict()
    json_response["game"] = game
    json_response["allLevels"] = all_levels
    json_response["error"] = error1+", "+error2
    return jsonify(json_response)

@app.route('/api/game', methods=['POST', 'PUT'])
def save_game():
    if not request.json or not 'title' in request.json:
        abort(400)

    json_response = Game.save_game(conn, request.json)

    return jsonify(json_response)

@app.route('/api/game/<id>', methods=['DELETE'])
def delete_game(id):
    json_response = Game.delete_game(conn, id)

    return jsonify(json_response)

"""
===========================
========= STUDENTS ==========
===========================
"""
@app.route('/api/student_login', methods=['POST'])
def check_student_info():
    if not request.json or not 'email' in request.json or not 'password' in request.json:
        abort(400)

    json_response = Student.check_students(conn,request.json)

    return jsonify(json_response)

@app.route('/api/students/<columns>', methods=['GET'])
def get_students(columns):
    students, error = Student.get_students(conn, columns)
    d = {}
    d["students"] = students
    d["error"] = error

    return jsonify(d)


@app.route('/api/student/<id>', methods=['GET'])
def get_student(id):
    student, error = Student.get_student(conn, id)
    json_response = dict()
    json_response["student"] = student
    json_response["error"] = error
    return jsonify(json_response)


@app.route('/api/student', methods=['POST', 'PUT'])
def save_student():
    if not request.json or not 'email' in request.json:
        abort(400)

    json_response = Student.save_student(conn, request.json)

    return jsonify(json_response)

@app.route('/api/student/<id>', methods=['DELETE'])
def delete_student(id):
    json_response = Student.delete_student(conn, id)

    return jsonify(json_response)



if __name__ == '__main__':
    conn = db_connect()
    app.run(debug=True)
    app.run(port=8000)


