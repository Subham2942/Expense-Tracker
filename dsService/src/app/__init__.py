from flask import Flask
from flask import request, jsonify
from service.messageService import MessageService

app = Flask(__name__)

messageService = MessageService()

@app.route('/ds/v1/message', methods=['POST'])
def handle_message():
    data = request.get_json(silent=True) or {}
    message = data.get('message')
    if not isinstance(message, str) or not message.strip():
        return jsonify({'error': 'message must be a non-empty string'}), 400

    result = messageService.process_message(message)
    return jsonify(result)

@app.route('/', methods=['GET'])
def handle_get():
    return 'Hello world'


if __name__ == "__main__":
    app.run(host="localhost", port=3000, debug=True)
