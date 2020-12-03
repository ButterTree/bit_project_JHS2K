from flask import request
def post_get_checker(data):
    if request.method == 'POST':
        data = request.get_json(silent=True)
    elif request.method == 'GET':
        data_buf = data
        return data_buf
    elif data == '':
        post_get_checker.close()
    return ''