numOfCities = 3

def getDaySplitsBetweenCities(totalDays):
    # Osaka -> Kyoto -> Tokyo
    citySplits = []
    totalDaysCopy = totalDays
    for i in range(numOfCities):
        citySplits.append(totalDays // numOfCities)
        totalDaysCopy -= totalDays // numOfCities
    
    
    # totalDaysCopy should be within [0, numOfCities)
    while totalDaysCopy > 0:
        citySplits[totalDaysCopy] += 1
        totalDaysCopy -= 1
    

    return citySplits
    
