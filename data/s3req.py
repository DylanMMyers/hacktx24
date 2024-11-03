import requests
import pandas as pd
import io

def req(url):
    response = requests.get(url)
    csv_content = response.content.decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_content))
    return df

def interestsmatch(criteria, row):
    if 'interests' in row.index:
        interests = row['interests'].split(',') if isinstance(row['interests'], str) else []
        return any(interest.strip() in criteria['interests'] for interest in interests)
    return False

def costfind(df, cost):
    for _, row in df.iterrows():
        if row['price_category'] != cost:
            continue
        if criteria['meal'] is not None and (row['Category'] != criteria['meal']):
            continue
        if (row['Name'] not in criteria['dont']) and (interestsmatch(criteria, row) or row['Ratings'] > 3):
            return row.to_dict()
    return -1

def findf(url, criteria):
    df = req(url)
    
    # then search through df for optimal event of ___ category
    # if found date is in dont, keep searching
    # if found date meets criteria, we can try to select it
    # cost must be met, interest should be met, rating high should be met but interest takes prio
    
    # df should contain ele objects, these will have qualities:
    # Category, Name, Price, Distance to Nearest Train Station, Ratings, Nearest Train Station
    
    if criteria['cost'] == 'low':
        newele = costfind(df, 'low')
    elif criteria['cost'] == 'mid':
        newele = costfind(df, 'mid')
    else:
        newele = costfind(df, 'high')

    if newele == -1:
        return 'Not found'
    else:
        return newele

if __name__ == '__main__':
    city = 'osaka'
    category = 'placestoeat'
    criteria = {
        'cost': 'low',
        'interests': ['sushi'],
        'meal' : 'Lunch',
        'dont': ['West Wood Bakers', 'Kushikatsu Daruma']  # names of events to not use
    }
    def run(city, category, criteria):
        url = f'https://nihangodb.s3.amazonaws.com/{city}_{category}.csv'
        result = findf(url, criteria)
        print(result)
        return result
    run(city, category, criteria)