import requests
import pandas as pd
import io
import ast

def req(url):
    response = requests.get(url)
    csv_content = response.content.decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_content))
    return df

def interestsmatch(criteria, row):
    if 'Tags' in row.index:
        try:
            tags = ast.literal_eval(row['Tags'])
        except (ValueError, SyntaxError):
            tags = [tag.strip() for tag in row['Tags'].strip('[]').split(',')]
        return any(interest.strip() in tags for interest in criteria['interests'])
    return False

def costfind(df, cost, criteria):
    inter = []
    rated = []
    for _, row in df.iterrows():
        if row['price_category'] != cost:
            continue
        if criteria['meal'] is not None and (row['Category'] != criteria['meal']):
            continue
        if (row['Name'] not in criteria['dont']):
            if interestsmatch(criteria, row):
                inter.append(row.to_dict())
            else:
                rated.append(row.to_dict())

    if len(inter) > 0:
        return max(inter, key=lambda x: x['Ratings'])
    elif len(rated) > 0:
        return max(rated, key=lambda x: x['Ratings'])
    else:
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
        newele = costfind(df, 'low', criteria)
    elif criteria['cost'] == 'mid':
        newele = costfind(df, 'mid', criteria)
    else:
        newele = costfind(df, 'high', criteria)

    if newele == -1:
        return 'Not found'
    else:
        return newele

def run(city, category, criteria):
        url = f'https://nihangodb.s3.amazonaws.com/{city}_{category}.csv'
        result = findf(url, criteria)
        return result

if __name__ == '__main__':
    city = 'osaka'
    category = 'placestoeat'
    criteria = {
        'cost': 'low',
        'interests': ['Sushi'],
        'meal' : None,
        'dont': []  # names of events to not use
    }
    
    run(city, category, criteria)