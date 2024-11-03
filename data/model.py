from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import json
import importlib
s3req = importlib.import_module("s3req")

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

# function that will put all text and objects passed into it into a json format
def broadcast_output(ai_output, **objects):
    print(ai_output)
    data = {
        "ai_output": ai_output,
        "objects": objects
    }
    json_data = json.dumps(data, indent = 4)
    return json_data

def website_introduction():
    ai_response_print = "Welcome to Nihon-go! Please select the preferences above to the best of your ability to start our convorsation."
    broadcast_output(ai_response_print)

website_introduction()

sample_data = ["mid", "7"]

def create_itinerary():
    global prompt

    system_query_food = f"The user will provide an explination of their trip ideas. Find anything to do with food, and return a list of what keywords from this list match their food opinions best: {food_string} Your output **must** contain items only from the list I provided in this prompt in this format: 'category1, category2, category3' and so on. **You can't** include any other information in your output, **you can't** describe the list, and **you can't** use new line characters."
    system_query_attractions = f"The user will provide an explination of their trip ideas. Find anything to do with where they want to go/what they want to do while in japan, and return a list of what keywords from this list match their attraction opinions best: {attractions_string} Your output **must** contain items only from the list I provided in this prompt in this format: 'category1, category2, category3' and so on. **You can't** include any other information in your output, **you can't** describe the list, and **you can't** use new line characters."
    system_query_stayingat = f"The user will provide an explination of their trip ideas. Find anything to do with their overnight stay, including accomodations or types of places they can stay while in japan, and return a list of what keywords from this list match their overnight options best:{places_to_stay_string} Your output **must** contain items only from the list I provided in this prompt in this format: 'category1, category2, category3' and so on. **You can't** include any other information in your output, **you can't** describe the list, and **you can't** use new line characters."
    
    travel_duration = int(sample_data[1])
    price_point = sample_data[0]
    locations = ["osaka", "kyoto", "tokyo"]

    query = input(">>> ")
    config = {"configurable": {"thread_id": "foodquerythread"}}
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_query_food,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    )
    input_messages = [HumanMessage(query)]
    output = app.invoke({"messages": input_messages}, config)
    food_output = output["messages"][-1].content
    food_output = food_output.split(", ")
    print(food_output)
    print("-----FOOD-----")
    print()
    for i in range(travel_duration):
        if i/travel_duration < 0.333:
            current_location = locations[0]
        elif i/travel_duration < 0.666:
            current_location = locations[1]
        else:
            current_location = locations[2]

        for j in range(3):
            if j == 0:
                meal = "Breakfast"
            elif j == 1:
                meal = "Lunch"
            else:
                meal = "Dinner"
            food_result = s3req.run(current_location, "placestoeat", {"cost": price_point, "interests": food_output, "meal": meal, "dont": dont_food})
            broadcast_output(food_result)
            if food_result == 'Not found':
                print(f"day {i+1} " + "No food found")
            else :
                print(f"day {i+1} " + meal, food_result['Name'])
                dont_food.append(food_result['Name'])

    config = {"configurable": {"thread_id": "attractionsquerythread"}}
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_query_attractions,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    )
    input_messages = [HumanMessage(query)]
    output = app.invoke({"messages": input_messages}, config)
    attractions_output = output["messages"][-1].content
    attractions_output = attractions_output.split(", ")
    print(attractions_output)
    print("-----ATTRACTIONS-----")
    print()
    for i in range(travel_duration):
        if i/travel_duration < 0.333:
            current_location = locations[0]
        elif i/travel_duration < 0.666:
            current_location = locations[1]
        else:
            current_location = locations[2]

        for j in range(2):
            attractions_result = s3req.run(current_location, "placestogo", {"cost": price_point, "interests": attractions_output, "meal": None, "dont": dont_go})
            broadcast_output(attractions_result)
            if attractions_result == 'Not found':
                print(f"day {i+1} " + "No attractions found")
            else:
                print(f"day {i+1}, attraction #{j+1} " + attractions_result['Name'])
                dont_go.append(attractions_result['Name'])

    config = {"configurable": {"thread_id": "stayingatquerythread"}}
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_query_stayingat,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    )
    input_messages = [HumanMessage(query)]
    output = app.invoke({"messages": input_messages}, config)
    places_to_stay_output = output["messages"][-1].content
    places_to_stay_output = places_to_stay_output.split(", ")
    print(places_to_stay_output)
    print("-----PLACES TO STAY-----")
    print()
    for i in range(travel_duration):
        if i/travel_duration < 0.333:
            current_location = locations[0]
        elif i/travel_duration < 0.666:
            current_location = locations[1]
        else:
            current_location = locations[2]
        places_to_stay_result = s3req.run(current_location, "placestostay", {"cost": price_point, "interests": places_to_stay_output, "meal": None, "dont": dont_stay})
        broadcast_output(places_to_stay_result)
        print(f"day {i+1} " + places_to_stay_result['Name'])

def start_conversation():
    global prompt
    ai_response_print = "Great! Now that we have a baseline for your preferences, lets fine tune your trip."
    broadcast_output(ai_response_print)
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Figure out where the user wants to do while in japan. Don't do any grand introductions. Ask about all of the following in your statement: food, attractions, and type of place to stay in. Keep it simple, don't ask multiple choice questions. ",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    )
    query = ""
    input_messages = [HumanMessage(query)]
    output = app.invoke({"messages": input_messages}, config)
    broadcast_output(output["messages"][-1].content)

    places_to_stay = {
    "24-hour Front Desk",
    "Airbnb",
    "Bar",
    "Bicycle Parking",
    "Bicycle Rental",
    "Bike Rental",
    "Breakfast Included",
    "Budget",
    "Business Center",
    "Cafe",
    "Central Location",
    "City View",
    "Communal Kitchen",
    "Concierge Service",
    "Convenience Store",
    "Cultural Experience",
    "Entire House",
    "Family Friendly",
    "Fine Dining",
    "Fitness Center",
    "Free Tea",
    "Free WiFi",
    "Fully Equipped Kitchen",
    "Garden View",
    "Highly Rated",
    "Hotel",
    "Japanese Garden",
    "Kitchenette",
    "Laundry Facilities",
    "Laundry Service",
    "Local Experience",
    "Lounge Area",
    "Luggage Storage",
    "Luxury",
    "Mid-range",
    "Modern Amenities",
    "Modern Design",
    "Movie Room",
    "Multiple Restaurants",
    "Pool",
    "Pocket WiFi",
    "Private Room",
    "Restaurant",
    "River View",
    "Rooftop Terrace",
    "Self Check-in",
    "Shared Bathroom",
    "Shared Facilities",
    "Shared Kitchen",
    "Shared Lounge",
    "Shopping Mall Access",
    "Social Activities",
    "Spa",
    "Tea Ceremony",
    "Traditional Architecture",
    "Traditional Decor",
    "Traditional Japanese Room",
    "Traditional Machiya",
    "Walking Distance",
    "Walking Tours",
    "Washing Machine",
    "Well Rated"
    }
    attractions = {
    "Historical Sites",
    "Cultural Landmarks",
    "Museums",
    "Parks and Gardens",
    "Shopping Districts",
    "Entertainment Areas",
    "Religious Sites",
    "Observation Decks",
    "Theme Parks",
    "Aquariums",
    "Markets",
    "Traditional Streets",
    "Modern Architecture",
    "Nature Spots",
    "Art Galleries",
    "Science Centers",
    "Family-Friendly",
    "Nightlife",
    "Food and Dining",
    "Scenic Views",
    "Unique Experiences",
    "Sports Venues",
    "Relaxation and Wellness",
    "Technology and Pop Culture",
    "Performing Arts",
    "Educational Attractions",
    "Waterfront Areas",
    "Wildlife and Zoos",
    "Seasonal Attractions",
    "Free Attractions"
    }
    food = {
    "Bread",
    "Sandwich",
    "Western Sweets",
    "Cake",
    "Cafe",
    "Bar",
    "Coffee Shop",
    "Dining Bar",
    "Asian Ethnic Cuisine",
    "Italian",
    "Lounge",
    "Curry Rice",
    "Sake Bar",
    "Other",
    "French",
    "Ryokan/Auberge (Other)",
    "Bar/Alcohol (Other)",
    "Yakiniku",
    "Buffet",
    "Izakaya",
    "Steak",
    "Hamburger",
    "Horse Sashimi",
    "Teppanyaki",
    "Seafood",
    "Sushi",
    "Japanese Cuisine",
    "Fried Chicken",
    "Yakitori",
    "Japanese Cuisine (Other)",
    "Motsunabe",
    "Wine Bar",
    "Pasta"
    }

    #function to convert food to string of text
    def convert_food(food):
        food_string = ""
        for item in food:
            food_string += item + ", "
        return food_string
    #function to convert places to stay to string of text
    def convert_places_to_stay(places_to_stay):
        places_to_stay_string = ""
        for item in places_to_stay:
            places_to_stay_string += item + ", "
        return places_to_stay_string
    #function to convert attractions to string of text
    def convert_attractions(attractions):
        attractions_string = ""
        for item in attractions:
            attractions_string += item + ", "
        return attractions_string
    
    global food_string
    global places_to_stay_string
    global attractions_string

    food_string = convert_food(food)
    places_to_stay_string = convert_places_to_stay(places_to_stay)
    attractions_string = convert_attractions(attractions)

    global dont_food
    global dont_go
    global dont_stay

    dont_food = []
    dont_go = []
    dont_stay = []

    create_itinerary()

    ai_response_print = "Now that we have a basic outline of the trip, we can start editing the trip to your liking. Is there anything you would like to change?"
    broadcast_output(ai_response_print)

    while(True):
        print(dont_food, dont_go, dont_stay)
        query = input(">>> ")

        prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "The user will say they want to change something or say they are happy with the trip. If they want to change something, agree and say you will change the itinerary to match their preferences. If they are happy with their changes or current, ask them if they would like to see the updated itinerary. Keep your answer short and sweet. Do not add a follow up question.",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
        )
        input_messages = [HumanMessage(query)]
        output = app.invoke({"messages": input_messages}, config)
        broadcast_output(output["messages"][-1].content)

        prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "If user doesnt want to change the itinerary, print only the word 'true' and **nothing** else. Otherwise, You must print out the name(s) of what they want to remove. Get spelling and capitalization from itinerary and use proper capitalization and spelling in your output. It must be the full name as it appears in the itinerary. Do **not** output it how the user typed it. Only output what is to be removed, nothing else. After, it will be followed by the category that it comes from based on where it was in the itinerary ('Food' or 'Attraction' or 'Accommodation'). Seperate the name and category by using ', '. You can't include any other information in your output, **you can't** describe the list, and **you can't** use new line characters.",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
        )
        input_messages = [HumanMessage(query)]
        output = app.invoke({"messages": input_messages}, config)
        check_if_listed = output["messages"][-1].content
        print(check_if_listed)
        if ", " in check_if_listed:
            check_if_listed = check_if_listed.split(", ")
            dont_food.append(check_if_listed[0])
            dont_go.append(check_if_listed[0])
            dont_stay.append(check_if_listed[0])
        else:
            ai_response_print = "Would you like to see the updated itinerary?"
            broadcast_output(ai_response_print)
            break

start_conversation()