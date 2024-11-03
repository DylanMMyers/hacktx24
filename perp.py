from openai import OpenAI
import pandas as pd


YOUR_API_KEY = "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"


def run(prompt):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an artificial intelligence assistant and you need to "
                "engage in a helpful, detailed, polite conversation with a user."
            ),
        },
        {
            "role": "user",
            "content": (
                prompt
            ),
        },
    ]


    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")


    # chat completion without streaming
    response = client.chat.completions.create(
        model="llama-3.1-sonar-small-128k-online",
        messages=messages,
    )
   
    return response.choices[0].message.content




if __name__ == "__main__":
    context = ["I want to eat sushi"]
    days = 5
    prompt = f"""You are a helpful chatbot whos goal is to help someone plan their vacation to Japan. You will be conversing with them about their plan, as well as generating
    a plan for them for a vacation that lasts {days}. The original plan should consist of 3 meals, 2-3 activities, and a place to stay at. They will tell you whether or not they like certain elements of the plan,
    and if they dislike certain elements you should remove them and replace them with something else. This should continue until the user states they are satisfied with,
    their plan. Be kind, and make sure you pay attention to what has been previously said in the previous comments. Here is memory of the rest of the conversation fr context: {context}
   
    Also, please output a list of the latitudes and longitudes of each unique location in a csv format."""
    print(run(prompt))