import requests
import pandas as pd
import io

def req(url):
    response = requests.get(url)
    csv_content = response.content.decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_content))
    return df

def interestsmatch(criteria, ele):
    for x in ele["interests"]:
        if ele["interests"] in criteria["interests"]:
            return True
    return False

def costfind(df, cost):
    for ele in df:
        if ele["cost"] != cost:
            continue
        if (ele not in criteria["dont"]) and (interestsmatch(criteria, ele) or ele["rating"] > 7):
            return ele
    return -1

def findf(url, dont, criteria):
    df = req(url)
    # then search through df for optimal event of ___ category
    # if found date is in dont, keep searching
    # if found date meets criteria, we can try to select it
    # cost must be met, interest should be met, rating high should be met but interest takes prio
    
    # df should contain ele objects, these will have qualities:
    # Category, Name, Price, Distance to Nearest Train Station, Ratings, Nearest Train Station
    
    # criteria should be a dict with attributes:
    # cost, days, interests, dont

    if criteria["cost"] == "low":
        newele = costfind(df, "low")
    elif criteria["cost"] == "mid":
        newele = costfind(df, "mid")
    else:
        newele = costfind(df, "high")

    if newele == -1:
        return "Not found"
    else:
        return newele

if __name__ == "__main__":
    city = "osaka"
    category = "placestoeat"
    url = f"https://nihangodb.s3.amazonaws.com/{city}_{category}.csv"
    criteria = {
        "cost" : "",
        "days" : "",
        "interests" : [],
        "dont" : [] # names of events to not use
    }
    findf(url, criteria, category)