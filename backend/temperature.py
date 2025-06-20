import os
import pandas as pd
import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import mpldatacursor
import matplotlib.dates as mdates
import plotly.graph_objects as go


class temperature():

    def __init__(self, start_date,end_date,latitude,longitude):
        self.start_date= start_date
        self.end_date= end_date
        self.longitude= longitude
        self.latitude = latitude

    
    def plot(self):
        # Define a list of file paths
        # Prod URL
        # Prod URL
        base_url = os.environ.get('GCS_BASE_URL') 

        file_paths = [f"{base_url}/NLDAS_temperature/avg.temperature.daily.2017.nc",
                      f"{base_url}/NLDAS_temperature/avg.temperature.daily.2018.nc",
                      f"{base_url}/NLDAS_temperature/avg.temperature.daily.2019.nc",
                      f"{base_url}/NLDAS_temperature/avg.temperature.daily.2020.nc",
                      f"{base_url}/NLDAS_temperature/avg.temperature.daily.2021.nc"]

        # Open each file and store them in a list of xarray datasets
        datasets = [xr.open_dataset(file_path) for file_path in file_paths]


        #Concate all the datasets along the dimension of time
        data = xr.concat(datasets, dim='time')

        #Extract latitude and longitude values from the dataset.
        lat_var = data.variables['lat']
        lon_var = data.variables['lon']
        
        # Get latitude and longitude values
        latitude = lat_var[:]
        longitude = lon_var[:]

        # Assuming you have captured specific lat and lon values from the map
        target_lat = float(self.latitude) 
        target_lon = float(self.longitude)

        # Find the nearest indices to the target lat and lon
        lat_idx = np.argmin(abs(latitude - target_lat).data)
        lon_idx = np.argmin(abs(longitude - target_lon).data)

        #Time values
        Time = pd.DatetimeIndex(data['time'].values)
        year = Time.year.values
        mth = Time.month.values
        day = Time.day.values

        #Date parsing format
        userInput_startDate = self.start_date #MM/DD/YYYY
        userInput_endDate = self.end_date #MM/DD/YYYY

        userInput_startDate_array = userInput_startDate.split('/')
        userInput_endDate_array = userInput_endDate.split('/')

        userInput_startDate_year = userInput_startDate_array[2]
        userInput_startDate_month = userInput_startDate_array[0]
        userInput_startDate_day = userInput_startDate_array[1]

        userInput_endDate_year = userInput_endDate_array[2]
        userInput_endDate_month = userInput_endDate_array[0]
        userInput_endDate_day = userInput_endDate_array[1]

        DD = [year, mth, day]

        #Start Dates and End dates 
        xc = np.where((DD[0] == int(userInput_startDate_year)) & (DD[1] == int(userInput_startDate_month)) & (DD[2] == int(userInput_startDate_day)))[0]
        xd = np.where((DD[0] == int(userInput_endDate_year)) & (DD[1] == int(userInput_endDate_month)) & (DD[2] == int(userInput_endDate_day)))[0]

        xx = np.arange(xc[0], xd[0]) 

        # print("xx size: ",xx.size)

        #Date Range (MM/DD/YYYY)
        dates = pd.date_range(userInput_startDate_month + '/' + userInput_startDate_day + '/' + userInput_startDate_year, 
                                periods= xx.size,
                                freq='d')


        #Extract the Total Temperature values from the data
        temp = data['temperature'].values

        #Subset of the Total Temperature Values for the selected time frame
        temp1 = temp[xx,:,:]

        # print("Temperature size: ",temp1.size)
        #Total Temperature Data at the specified location and time period
        temp_data = temp1[:, lat_idx, lon_idx]

        # Convert temperature from Kelvin to Fahrenheit
        temp_data_fahrenheit = (temp_data - 273.15) * 9/5 + 32

        latitude = data['lat'].values
        longitude = data['lon'].values

        # Create the figure
        fig = go.Figure()

        # Add the line trace for the data
        fig.add_trace(go.Scatter(x=dates, y=temp_data_fahrenheit, mode='lines', name=' Temperature', hoverinfo='text', 
                                hovertext=[f'Date: {date.strftime("%Y-%b-%d")}, Total Temperature: {val:.2f}' for date, val in zip(dates, temp_data_fahrenheit)],
                                marker=dict(color='red')))
        # Update layout
        fig.update_layout(title={
                            'text': ' Temperature Values at Lat: ' + str(latitude[lat_idx]) + ', Lon: ' + str(longitude[lon_idx]) ,
                            'x':0.5,  # Set the x position to center
                            'xanchor': 'center',  # Anchor point for the x position
                            'yanchor': 'top'  # Anchor point for the y position
                        },
                        xaxis_title='Time',
                        yaxis_title='Air temparature (°F)',
                        xaxis=dict(tickformat="%Y-%b-%d", tickangle=45,
                                    range=[dates[0] - pd.Timedelta(days=10), dates[-1] + pd.Timedelta(days=10)]),  # Increase buffer by 10 days
                        yaxis=dict(fixedrange=True),
                        hovermode="x unified",
                        legend=dict(orientation="h", yanchor="top", y=1.10, xanchor="left", x=0.03,
                                    itemsizing='constant'))  # Ensure legend item size is constant

        # Return the plot
        return fig
