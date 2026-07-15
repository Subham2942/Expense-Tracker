from flask import Flask
from flask import request, jsonify
from .service.messageService import MessageService
from kafka import KafkaProducer
import json
import os

app = Flask(__name__)

messageService = MessageService()

producer = KafkaProducer(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092'),
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)


@app.route('/ds/v1/message', methods=['POST'])
def handle_message():
    data = request.get_json(silent=True) or {}
    message = data.get('message')
    if not isinstance(message, str) or not message.strip():
        return jsonify({'error': 'message must be a non-empty string'}), 400

    result = messageService.process_message(message)

    producer.send('bank-messages', result)

    return jsonify(result)

@app.route('/', methods=['GET'])
def handle_get():
    return 'Hello world'


if __name__ == "__main__":
    app.run(host="localhost", port=3000, debug=True)
