import requests
import pandas as pd
import io

def req(url):
    response = requests.get(url)
    csv_content = response.content.decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_content))
    return df

def findf(url, dont, criteria):
    df = req(url)
    # then search through df for optimal event of ___ category
    # if found date is in dont, keep searching
    # if found date meets criteria, we can try to select it
    # cost must be met, interest should be met, rating high should be met but interest takes prio
    
    interestsmatch = None
    
    if criteria["cost"] == "low":
        # placeholders
        for ele in df:
            if (ele not in dont) and (interestsmatch is True):
                return ele
        a = 1
    elif criteria["cost"] == "mid":
        b = 1
    else:
        c = 1



if __name__ == "__main__":
    city = "osaka"
    category = "placestoeat"
    url = f"https://nihangodb.s3.amazonaws.com/{city}_{category}.csv"
    dont = [] # names of events to not use
    criteria = {
        "cost" : "",
        "days" : "",
        "ct" : 0, # avg commute time
        "interests" : []
    }
    findf(url, dont, criteria, category)