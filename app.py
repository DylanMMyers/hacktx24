from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key='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')

# Store conversations in memory (in a production environment, use a database)
conversations = {}

@app.route('/parse', methods=['POST'])
def parse():
    try:
        data = request.json
        text = data.get('text', '')

        # First, get a list of locations from the text using GPT
        location_prompt = [{"role": "system", "content": "Extract only the specific location names from the following text. Return them as a comma-separated list. Only include actual place names in Japan, not general descriptions."},
                         {"role": "user", "content": text}]
        
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=location_prompt,
            temperature=0.3,
            max_tokens=200
        )
        
        locations_text = completion.choices[0].message.content
        locations = [loc.strip() for loc in locations_text.split(',')]

        # For each location, get coordinates using GPT
        coordinates = []
        for location in locations:
            coord_prompt = [{"role": "system", "content": "You are a geography expert. Provide the latitude and longitude coordinates for this location in Japan. Return ONLY the coordinates in this exact format: latitude,longitude"},
                          {"role": "user", "content": f"What are the coordinates for {location}, Japan?"}]
            
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=coord_prompt,
                temperature=0.3,
                max_tokens=50
            )
            
            coords = completion.choices[0].message.content.strip()
            try:
                lat, lon = map(float, coords.split(','))
                coordinates.append({
                    "location": location,
                    "coordinates": [lat, lon]
                })
            except ValueError:
                continue

        return jsonify({
            "locations": coordinates
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']
    conversation_id = data.get('conversation_id', 'default')
    preferences = data.get('preferences', {})
    budget = preferences.get('budget', '$')
    days = preferences.get('days', '1')

    # Initialize conversation history if it doesn't exist
    if conversation_id not in conversations:
        conversations[conversation_id] = [
            {"role": "system", "content": f"""You are a helpful travel assistant for Japan. 
            Create detailed itineraries based on these preferences:
            - Budget:
            - Length of stay
            Be specific with times, places, and activities. Include estimated costs when possible."""}
        ]

    # Add user message to conversation history
    conversations[conversation_id].append({"role": "user", "content": user_message})

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversations[conversation_id],
            temperature=0.7,
            max_tokens=1000
        )
        
        response = completion.choices[0].message.content
        
        # Add assistant's response to conversation history
        conversations[conversation_id].append({"role": "assistant", "content": response})
        
        return jsonify({
            "response": response,
            "conversation_id": conversation_id
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 