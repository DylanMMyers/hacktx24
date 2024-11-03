import s3req

object = s3req.run(
    "osaka", 
    "placestoeat", 
    {
    'cost': 'low',
    'interests': ['Sushi'],
    'meal': 'Lunch',
    'dont': []
    }
)

print(object)