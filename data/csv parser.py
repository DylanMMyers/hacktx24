import pandas as pd
import numpy as np

# UTILITY FILE FOR ONE TIME USE

# Read the CSV file
df = pd.read_csv(r'C:\coding\hacktx24\data\csvs\tokyo\tokyo_placestostay.csv')

# Calculate the quantiles
low_quantile = df['Price'].quantile(0.33)
high_quantile = df['Price'].quantile(0.67)

# Create a new column 'price_category' based on the price values
df['price_category'] = pd.cut(df['Price'], 
                              bins=[-np.inf, low_quantile, high_quantile, np.inf], 
                              labels=['low', 'mid', 'high'])

# Save the updated DataFrame to a new CSV file
df.to_csv('updated_kyoto_placestostay.csv', index=False)

print("Processing complete. Updated file saved as 'updated_kyoto_placestostay.csv'.")