# -*- coding: utf-8 -*-
import pandas as pd
import xarray as xr
import numpy as np
import plotly.graph_objects as go
import fsspec
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class evapotranspiration:
    """Class for handling evapotranspiration data from public Google Cloud Storage."""

    def __init__(self, start_date, end_date, latitude, longitude):
        """
        Initialize the evapotranspiration data handler.
        
        Args:
            start_date (str): Start date in format 'MM/DD/YYYY'
            end_date (str): End date in format 'MM/DD/YYYY'
            latitude (float): Target latitude
            longitude (float): Target longitude
        """
        self.start_date = start_date
        self.end_date = end_date
        self.latitude = float(latitude)
        self.longitude = float(longitude)
        self.file_paths = [
            'gs://miz_hydrology/Backend_Data/NLDAS_evapotranspiration/actvap.daily.2017.nc',
            'gs://miz_hydrology/Backend_Data/NLDAS_evapotranspiration/actvap.daily.2018.nc',
            'gs://miz_hydrology/Backend_Data/NLDAS_evapotranspiration/actvap.daily.2019.nc',
            'gs://miz_hydrology/Backend_Data/NLDAS_evapotranspiration/actvap.daily.2020.nc',
            'gs://miz_hydrology/Backend_Data/NLDAS_evapotranspiration/actvap.daily.2021.nc'
        ]

        try:
            self.fs = fsspec.filesystem('gcs', token='anon')
            logger.info("Initialized GCS filesystem for public access")
        except Exception as e:
            logger.error(f"Failed to initialize GCS filesystem: {e}")
            raise

    def load_data(self):
        """Load and concatenate evapotranspiration datasets."""
        datasets = []

        for file in self.file_paths:
            try:
                logger.info(f"Opening file: {file}")
                with self.fs.open(file, 'rb') as f:
                    try:
                        ds = xr.open_dataset(f, engine='h5netcdf')
                    except:
                        f.seek(0)
                        ds = xr.open_dataset(f, engine='scipy')
                    datasets.append(ds)
                    logger.info(f"Loaded: {file}")
            except Exception as e:
                logger.error(f"Failed to load {file}: {e}")
                raise

        if not datasets:
            raise ValueError("No datasets were successfully loaded.")
        
        return xr.concat(datasets, dim='time')

    def validate_dates(self, data):
        """Ensure selected dates are within available range."""
        time_values = pd.to_datetime(data['time'].values)
        try:
            start = pd.to_datetime(self.start_date, format='%m/%d/%Y')
            end = pd.to_datetime(self.end_date, format='%m/%d/%Y')
        except Exception as e:
            logger.error(f"Invalid date format: {e}")
            raise ValueError("Dates must be in MM/DD/YYYY format")

        if start < time_values[0] or end > time_values[-1]:
            raise ValueError(f"Selected range ({start} - {end}) is out of bounds ({time_values[0]} - {time_values[-1]})")

        return start, end

    def find_nearest_grid_point(self, data):
        """Find the grid point closest to given coordinates."""
        lat_values = data['lat'].values
        lon_values = data['lon'].values

        lat_idx = np.argmin(np.abs(lat_values - self.latitude))
        lon_idx = np.argmin(np.abs(lon_values - self.longitude))

        actual_lat = lat_values[lat_idx]
        actual_lon = lon_values[lon_idx]
        logger.info(f"Nearest grid point located at lat={actual_lat}, lon={actual_lon}")

        return lat_idx, lon_idx, actual_lat, actual_lon

    def extract_variable(self, data, start, end, lat_idx, lon_idx):
        """Extract variable values for selected time and location."""
        mask = (data['time'].values >= np.datetime64(start)) & (data['time'].values <= np.datetime64(end))
        variable = data['Actual_vapor_pressure'][mask, lat_idx, lon_idx]
        if variable.size == 0:
            raise ValueError("No data found for the selected period and location.")
        return variable, pd.date_range(start, end)

    def plot(self):
        """Plot evapotranspiration values with statistics and date range tools."""
        try:
            data = self.load_data()
            start, end = self.validate_dates(data)
            lat_idx, lon_idx, actual_lat, actual_lon = self.find_nearest_grid_point(data)
            values, dates = self.extract_variable(data, start, end, lat_idx, lon_idx)

            mean_val = float(np.nanmean(values))
            std_val = float(np.nanstd(values))

            fig = go.Figure()
            fig.add_trace(go.Scatter(
                x=dates,
                y=values,
                mode='lines',
                name='Evapotranspiration',
                line=dict(color='darkorange', width=2),
                hovertemplate='Date: %{x|%b %d, %Y}<br>Value: %{y:.2f} mm/day<extra></extra>'
            ))

            fig.add_hline(
                y=mean_val,
                line_dash="dot",
                line_color="green",
                annotation_text=f"Mean: {mean_val:.2f} mm/day",
                annotation_position="bottom right"
            )

            fig.update_layout(
                title={
                    'text': (
                        f"Daily Evapotranspiration at Latitude {actual_lat:.4f}°, "
                        f"Longitude {actual_lon:.4f}°"
                    ),
                    'x': 0.5,
                    'xanchor': 'center'
                },
                xaxis_title="Date",
                yaxis_title="Evapotranspiration (mm/day)",
                xaxis=dict(
                    tickformat="%b %d, %Y",
                    tickangle=45,
                    rangeslider=dict(visible=True),
                    rangeselector=dict(
                        buttons=[
                            dict(count=1, label="1m", step="month", stepmode="backward"),
                            dict(count=6, label="6m", step="month", stepmode="backward"),
                            dict(count=1, label="YTD", step="year", stepmode="todate"),
                            dict(count=1, label="1y", step="year", stepmode="backward"),
                            dict(step="all")
                        ]
                    )
                ),
                hovermode="x unified",
                legend=dict(orientation="h", yanchor="top", y=1.1, xanchor="right", x=1),
                margin=dict(l=20, r=20, t=80, b=80),
                plot_bgcolor='rgba(240,240,240,0.8)'
            )

            logger.info("Evapotranspiration plot generated successfully")
            return fig

        except Exception as e:
            logger.error(f"Plotting error: {e}")
            fig = go.Figure()
            fig.update_layout(
                title="Error Generating Plot",
                annotations=[{
                    'text': f"Error: {e}",
                    'xref': "paper", 'yref': "paper",
                    'x': 0.5, 'y': 0.5,
                    'showarrow': False,
                    'font': {'size': 16}
                }],
                plot_bgcolor='rgba(240,240,240,0.8)'    
            )
            return fig
