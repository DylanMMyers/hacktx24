import s3req

def findf(out, ):
    s3req.req("https://nihangodb.s3.amazonaws.com/hostel.csv", out)
    

if __name__ == "__main__":
    out = "data"
    findf(out)