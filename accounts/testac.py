from account import register_user, login_user, save_conversation, get_conversation, get_user_data, update_user_data
import json

def main():
    username = "japan_enthusiast"
    password = "sakura_2024"
    chat_name = "Japan Travel Plans"

    # Step 1: Register a new user
    register_result = register_user(username, password)
    print("Registration result:", register_result)

    # Step 2: Log in
    login_result = login_user(username, password)
    print("Login result:", login_result)

    # Step 3: Update user data (save a conversation)
    conversation_data = {
        "destinations": ["Tokyo", "Kyoto", "Osaka"],
        "duration": "14 days",
        "budget": "5000 USD",
        "activities": ["Visit temples", "Try local cuisine", "Attend a tea ceremony"]
    }
    update_result = save_conversation(username, chat_name, conversation_data)
    print("Update result:", update_result)

    # Step 4: Retrieve user data
    user_data = get_user_data(username)
    if user_data:
        print("\nUser Data:")
        print(json.dumps(user_data, indent=2))
    else:
        print("Failed to retrieve user data")

    # Step 5: Retrieve specific conversation
    conversation = get_conversation(username, chat_name)
    if isinstance(conversation, str):
        print("\nFailed to retrieve conversation:", conversation)
    else:
        print("\nRetrieved conversation:")
        print(json.dumps(conversation, indent=2))

if __name__ == "__main__":
    main()