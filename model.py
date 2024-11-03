from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import sys
import time

config = {"configurable": {"thread_id": "abc123"}}
model = Ollama(model="llama3.2")
workflow = StateGraph(state_schema=MessagesState)
def call_model(state: MessagesState):
    chain = prompt | model
    response = chain.invoke(state)
    return {"messages": response}
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)


def print_character_by_character(text, delay=0.02):
    for char in text:
        if char == '\n':
            sys.stdout.write(char)  
            sys.stdout.flush()       
        else:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(delay)
    print()

def website_introduction():
    print("Welcome to Nihon-go! Please select the preferences above to the best of your ability to start our convorsation.")

website_introduction()

def start_conversation():
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Promt the user with some form of: how can I help you today?",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    )
    query = ""
    input_messages = [HumanMessage(query)]
    output = app.invoke({"messages": input_messages}, config)
    print_character_by_character(output["messages"][-1].content)
    while(True):
        prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
        )
        query = input(">>> ")
        input_messages = [HumanMessage(query)]
        output = app.invoke({"messages": input_messages}, config)
        print_character_by_character(output["messages"][-1].content)

start_conversation()