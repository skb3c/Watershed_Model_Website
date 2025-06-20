import os
import pandas as pd
import xarray as xr
import numpy as np
import plotly.graph_objects as go


class precipitation:

    def __init__(self, start_date,end_date,latitude,longitude):
        self.start_date= start_date
        self.end_date= end_date
        self.longitude= longitude
        self.latitude = latitude

    def plot(self):
        # Define a list of file paths
        # Prod URL
        base_url = os.environ.get('GCS_BASE_URL') 

        file_paths = [f"{base_url}/NLDAS_precipitation/prcp.daily.2017.nc",
                      f"{base_url}/NLDAS_precipitation/prcp.daily.2018.nc",
                      f"{base_url}/NLDAS_precipitation/prcp.daily.2019.nc",
                      f"{base_url}/NLDAS_precipitation/prcp.daily.2020.nc",
                      f"{base_url}/NLDAS_precipitation/prcp.daily.2021.nc"]
        
        # file_paths = ["/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/prcp.daily.2017.nc",
        #             "/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/prcp.daily.2018.nc",
        #             "/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/prcp.daily.2019.nc",
        #             "/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/prcp.daily.2020.nc",
        #             "/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/prcp.daily.2021.nc"]


        # Open each file and store them in a list of xarray datasets
        datasets = [xr.open_dataset(file_path) for file_path in file_paths]


        #Concate all the datasets along the dimension of time
        data = xr.concat(datasets, dim='time')

        #Extract latitude and longitude values from the dataset.
        lat_var = data.variables['lat']
        lon_var = data.variables['lon']

        lat_var1 = data['lat'].values
        lon_var1 = data['lon'].values


        # Get latitude and longitude values
        latitude = lat_var[:]
        longitude = lon_var[:]

        # Assuming you have captured specific lat and lon values from the map
        target_lat = float(self.latitude) 
        target_lon = float(self.longitude)

        # Find the nearest indices to the target lat and lon
        lat_idx = np.argmin(abs(latitude - target_lat).data)
        lon_idx = np.argmin(abs(longitude - target_lon).data)

        # Access a specific variable
        variable = data.variables['time']

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


        #Extract the Total Precipitation values from the data
        prcp = data['Total Precipitation'].values

        #Subset of the Total Precipitation Values for the selected time frame
        prcp1 = prcp[xx,:,:]

        #Total Precipitation Data at the specified location and time period
        prcp_data = prcp1[:, lat_idx, lon_idx]

        cumulative_precipitation = np.cumsum(prcp_data)

        # Get the cumulative precipitation value for the latest date
        latest_cumulative_precipitation = cumulative_precipitation[-1]

        # Create the hover text for the line trace
        hover_text_line = [f'Cumulative Precipitation: {latest_cumulative_precipitation:.2f} mm' for _ in dates]
        # Create the figure
        fig = go.Figure()

        # Add the line trace for the data
        fig.add_trace(go.Bar(x=dates, y=prcp_data, name='Total Precipitation', hoverinfo='text', 
                                hovertext=[f'Date: {date.strftime("%Y-%b-%d")}, Total Precipitation: {val:.2f}' for date, val in zip(dates, prcp_data)],
                                marker=dict(color='red')))
        hover_text_line = []
        for i, date in enumerate(dates):
            cumulative_value = cumulative_precipitation[i]
            hover_text_line.append(f' Cumulative Precipitation: {cumulative_value:.2f} mm')

        # Add the line trace for the cumulative precipitation
        fig.add_trace(go.Scatter(x=dates, y=cumulative_precipitation, name='Cumulative Precipitation',
                                 hoverinfo='text', hoverlabel=dict(bgcolor="white"),
                                 hovertext=hover_text_line,
                                 line=dict(color='blue', width=2),
                                 yaxis='y2'))

        # Update layout
        fig.update_layout(
            title={
                'text': f'Total Precipitation and Cumulative Precipitation Values at Lat: {lat_var1[lat_idx]}, Lon: {lon_var1[lon_idx]}',
                'x':0.5,  # Set the x position to center
                'xanchor': 'center',  # Anchor point for the x position
                'yanchor': 'top'  # Anchor point for the y position
            },
            xaxis_title='Time',
            yaxis_title='Total Precipitation (mm)',
            xaxis=dict(tickformat="%Y-%b-%d", tickangle=45,
                        range=[dates[0] - pd.Timedelta(days=10), dates[-1] + pd.Timedelta(days=10)]),  # Increase buffer by 10 days
            yaxis=dict(fixedrange=True),
            yaxis2=dict(overlaying='y', side='right', title={'text': 'Cumulative Precipitation (mm)'}, fixedrange=True, gridwidth=2, griddash='dot'),
            hovermode="x unified",
            legend=dict(orientation="h", yanchor="top", y=1.10, xanchor="left", x=0.03,
                        itemsizing='constant'))  # Ensure legend item size is constant

        
        # Return the plot
        return fig
