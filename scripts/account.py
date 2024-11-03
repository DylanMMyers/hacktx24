import boto3
import json
import bcrypt
import os
import uuid

s3 = boto3.client('s3')
BUCKET_NAME = 'nihangoaccounts'

def get_user_data(username):
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=f'users/{username}.json')
        return json.loads(response['Body'].read().decode('utf-8'))
    except s3.exceptions.NoSuchKey:
        return None

def update_user_data(username, user_data):
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=f'users/{username}.json',
        Body=json.dumps(user_data),
        ServerSideEncryption='AES256'
    )

def register_user(username, password):
    if get_user_data(username):
        return "Username already exists"
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = {
        'username': username,
        'password_hash': hashed_password.decode('utf-8'),
        'conversation_names': [],
        'conversations': {}
    }
    update_user_data(username, user_data)
    return "User registered successfully"

def login_user(username, password):
    user_data = get_user_data(username)
    if user_data and bcrypt.checkpw(password.encode('utf-8'), user_data['password_hash'].encode('utf-8')):
        return "Login successful"
    return "Login failed"

def save_conversation(username, chat_name, chat_data):
    user_data = get_user_data(username)
    if not user_data:
        return "User not found"
    
    if chat_name not in user_data['conversation_names']:
        user_data['conversation_names'].append(chat_name)
    
    user_data['conversations'][chat_name] = chat_data
    update_user_data(username, user_data)
    return f"Conversation '{chat_name}' saved successfully"

def get_conversation(username, chat_name):
    user_data = get_user_data(username)
    if not user_data:
        return "User not found"
    
    conversation = user_data['conversations'].get(chat_name)
    if conversation:
        return conversation
    return f"Conversation '{chat_name}' not found"

def get_all_conversations(username):
    user_data = get_user_data(username)
    if not user_data:
        return "User not found"
    
    return user_data['conversations']
