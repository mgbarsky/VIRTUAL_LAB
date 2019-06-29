from general_db import *
from utils import *

def ParsePython(conn, data):
    problem_input = data['data']

    sanitized_problem, err = sanitize_problem(problem_input)
    if err is not None:
        print(err)
        return None, err

    else:
        print(sanitized_problem)
        return True, err


def sanitize_problem(user_script):
    safe_imports = ['math', 'random', 'datetime', 'functools', 'operator',
                    'string', 'collections', 're', 'json', 'heapq', 'bisect',
                    'numpy', 'scipy', 'typing', 'io']

    BANNED_BUILTINS = ('reload', 'input', 'apply', 'open', 'compile',
                       'file', 'eval', 'exec', 'execfile',
                       'exit', 'quit', 'raw_input', 'help',
                       'dir', 'globals', 'locals', 'vars')

    code_lines = user_script.split("\n")

    import_statement = "import {0}"
    import_as_variable = "{0} = {1}"

    err = None

    i = 0
    while (i < len(code_lines)):
        line = code_lines[i]
        # hack for import as statements; imports the module and sets
        # the variable after "as" to point to that module
        if ("import " in line) and ("as " in line):
            short_ind = line.find("as")
            short_name = line[short_ind + 3:].split()[0]
            import_ind = line.find("import")
            import_name = line[import_ind + 7:].split()[0]
            if import_name in safe_imports:
                code_lines[i] = import_statement.format(import_name)
                i += 1
                code_lines.insert(i, import_as_variable.format(short_name, import_name))
            else:
                err = "The import '{0}' was found in your program; please remove it.".format(import_name)

        # hack for "from ... import" statements; imports the module and
        # sets the variable to point to that item
        elif ("from" in line) and (" import " in line):
            from_ind = line.find("from ")
            import_ind = line.find("import")
            import_name = line[from_ind + 5: import_ind].strip()
            short_names = line[import_ind + 6:].split(',')
            if import_name in safe_imports:
                code_lines[i] = import_statement.format(import_name)
                for sname in short_names:
                    i += 1
                    code_lines.insert(i, "{0} = {1}.{0}".format(sname.strip(), import_name))
            else:
                err = "The import '{0}' was found in your program; please remove it.".format(import_name)

        elif "import " in line:
            ind = line.find("import")
            pre_import = line[: ind + 7]
            import_list = line[ind + 7:].split()
            for item in import_list:
                if item not in safe_imports:
                    err = "The import '{0}' was found in your program; please remove it.".format(item)

        # remove lines with banned builtins
        for banned_builtin in BANNED_BUILTINS:
            if banned_builtin in line:
                err = "The string '{0}' was found in your program; please remove it.".format(banned_builtin)

        i += 1
    return code_lines, err