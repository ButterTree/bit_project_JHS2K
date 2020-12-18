from flask import Flask, request

server = Flask(__name__)

@server.route("/", methods=['GET', 'POST'])
def let_me_shine():
    if request.method == 'POST':
        return "Post"
    else:
        return "Get"