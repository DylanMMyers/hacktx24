from flask import Flask, request, jsonify
from flask_cors import CORS
from access_acc import run

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})  # This enables CORS for all routes

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the registration service!"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get JSON data sent from the client
    
    # Print JSON data as a string for debugging
    print("Received JSON data:", data)

    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    
    # Call the run function from access_acc.py with the register flag
    result = run(username, password, register=True, login=False, update=False, retrieve=False, chat_data=None, chat_name=None)
    
    return jsonify({"message": result})

# Place this at the bottom of the script
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)  # Ensure this line is here to run the Flask app
