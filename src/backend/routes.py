import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))
from data.model import broadcast_output, app, config
from langchain_core.messages import HumanMessage
from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

@api.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        
        # Create a human message from the user input
        input_messages = [HumanMessage(content=user_message)]
        
        # Process through the LLM workflow
        output = app.invoke({"messages": input_messages}, config)
        
        # Get the AI response
        ai_response = output["messages"][-1].content
        
        # Format the response using broadcast_output
        formatted_response = broadcast_output(ai_response)
        
        return jsonify(formatted_response)
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")  # For debugging
        return jsonify({
            'error': str(e),
            'message': 'An error occurred processing your request',
            'locations': []
        }), 500