from account import register_user, login_user, save_conversation, get_conversation, get_all_conversations
import json

def run(user, pasw, register, login, update, retrieve, chat_data, chat_name):
    if register:
        result = register_user(user, pasw)
        return result
        
    if login:
        login_result = login_user(user, pasw)
        print(login_result)

    if update:
        if not chat_name:
            chat_name = f"Chat_{len(get_all_conversations(user)) + 1}"
        save_result = save_conversation(user, chat_name, chat_data)
        print(save_result)
        return None

    if retrieve:
        if chat_name:
            conversation = get_conversation(user, chat_name)
            print(json.dumps(conversation, indent=2))
            return conversation
        else:
            all_conversations = get_all_conversations(user)
            print(json.dumps(all_conversations, indent=2))
            return all_conversations

if __name__ == '__main__':
    user = None
    pasw = None
    register = False
    login = False
    update = False
    retrieve = False
    chat_data = None
    chat_name = None
    run(user, pasw, register, login, update, retrieve, chat_data, chat_name)