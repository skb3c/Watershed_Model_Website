import xarray as xr
import numpy as np
import plotly.graph_objects as go

class climateIndices:

    def __init__(self, latitude, longitude, SDII, RX5, RR1, RX1, R10, R20, PRCPTOT, CDD, CWD):
        self.longitude= longitude
        self.latitude = latitude
        self.SDII = SDII
        self.RX5 = RX5
        self.RR1 = RR1
        self.RX1 = RX1
        self.R10 = R10
        self.R20 = R20
        self.PRCPTOT = PRCPTOT
        self.CDD = CDD
        self.CWD = CWD


    
    def processData(self, path, index_name, desired_lat, desired_lon, text, yaxis_units):

        dataset = xr.open_dataset(path)

        # Extract latitude and longitude values
        latitude = dataset['lat'].values
        longitude = dataset['lon'].values

        # Find the indices of the nearest latitude and longitude values
        lat_idx = np.argmin(np.abs(latitude - float(desired_lat)))
        lon_idx = np.argmin(np.abs(longitude - float(desired_lon)))

        # Get the index data for the nearest latitude and longitude
        index_values = dataset[index_name][:, lat_idx, lon_idx].values
        time = dataset['time'].values

        final_lat_value = latitude[lat_idx]
        final_lon_value = longitude[lon_idx]
        # Create an interactive line plot using Plotly
        fig = go.Figure()

        fig.add_trace(go.Scatter(x=time, y=index_values, mode='lines+markers', name=index_name))

        fig.update_layout(
            title={
                'text': index_name + ' Index Variation at Latitude: ' + str(final_lat_value) + ', Longitude: ' + str(final_lon_value) + " from 1980 to 2021 ",
                'x':0.5,  # Set the x position to center
                'xanchor': 'center',  # Anchor point for the x position
                'yanchor': 'top'  # Anchor point for the y position
            },
            annotations=[
                            dict(
                                x=0,
                                y=1.05,
                                xref="paper",
                                yref="paper",
                                text= text,
                                showarrow=False,
                                font=dict(
                                    family="Arial",
                                    size=12,
                                    color="rgb(150,150,150)"
                                )
                            )
                        ],
            xaxis_title='Time',
            yaxis_title= index_name + " (" + yaxis_units+ ") ",
            xaxis=dict(tickangle=-45),
            template='plotly'  # Use a light theme
        )

        return fig
    

    def plot(self):

        response = {}
        file_path = "./data/NLDAS_Climate_Indices/NLDAS" #Prod URL
        if(self.SDII):
            file_name = "/USA_SDII_yearly_NLDAS_1980_2021.nc"
            index_name = "SDII"
            yaxis_units = "mm/day"
            text = "SDII: Simple Precipitation Intensity Index"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['SDII_image'] = fig.to_json()
        if(self.RX5):
            file_name = "/USA_RX5day_yearly_NLDAS_1980_2021.nc"
            index_name = "RX5day"
            yaxis_units = "mm"
            text = "RX5: Maximum 5-day precipitation"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['RX5_image'] = fig.to_json()
        if(self.RR1):
            file_name = "/USA_RR1_yearly_NLDAS_1980_2021.nc"
            index_name = "RR1"
            yaxis_units = "days"
            path = file_path + file_name
            text = 'The number of wet days per year with precipitation greater than 1mm'
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['RR1_image'] = fig.to_json()
        if(self.RX1):
            file_name = "/USA_RX1day_yearly_NLDAS_1980_2021.nc"
            index_name = "RX1day"
            yaxis_units = "mm"
            text = "RX1: Maximum 1-day precipitation"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['RX1_image'] = fig.to_json()
        if(self.R10):
            file_name = "/USA_R10mm_yearly_NLDAS_1980_2021.nc"
            index_name = "R10mm"
            yaxis_units = "days"
            text = "R10mm: Annual Count of days when precipitation is greater than or equal to 10mm"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['R10_image'] = fig.to_json()
        if(self.R20):
            file_name = "/USA_R20mm_yearly_NLDAS_1980_2021.nc"
            index_name = "R20mm"
            yaxis_units = "days"
            text = "R20mm: Annual Count of days when precipitation is greater than or equal to 20mm"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['R20_image'] = fig.to_json()
        if(self.PRCPTOT):
            file_name = "/USA_PRCPTOT_yearly_NLDAS_1980_2021.nc"
            index_name = "PRCPTOT"
            text = "PRCPTOT : Total Yearly Precipitation"
            yaxis_units = "mm"
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['PRCPTOT_image'] = fig.to_json()
        if(self.CDD):
            file_name = "/USA_CDD_yearly_NLDAS_1980_2021.nc"
            index_name = "CDD"
            yaxis_units = "days"
            text = 'CDD: Maximum number of consecutive days with less than 1mm of precipitation per day'
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['CDD_image'] = fig.to_json()
        if(self.CWD):
            file_name = "/USA_CWD_yearly_NLDAS_1980_2021.nc"
            index_name = "CWD"
            yaxis_units = "days"
            text = 'CWD: Maximum number of consecutive days with more than or equal to 1mm of precipitation per day'
            path = file_path + file_name
            fig = self.processData(path, index_name, self.latitude, self.longitude, text, yaxis_units)
            response['CWD_image'] = fig.to_json()

        return  response

