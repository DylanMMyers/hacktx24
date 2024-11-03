from flask import Flask, request, jsonify
from flask_cors import CORS
from access_acc import run

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})
  # This enables CORS for all routes

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the registration service!"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get JSON data sent from the client
    username = data.get('username')
    password = data.get('password')
    
    # Logic for handling registration
    result = {
        "message": f"User '{username}' registered successfully!"
    }
    return jsonify(result)

# trial code // running on our host
app.run(host="0.0.0.0", port=80, debug=True)
