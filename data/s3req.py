import requests
import pandas as pd
import io

def req(url, out):
    response = requests.get(url)
    csv_content = response.content.decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_content))
    df.to_csv(f"{out}.csv", index=False)

if __name__ == "__main__":
    url = "https://nihangodb.s3.amazonaws.com/Hostel.csv"
    out = "hostel_data"
    req(url, out)