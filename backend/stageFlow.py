import plotly.graph_objs as go
from dateutil.parser import isoparse
import pandas as pd
from datetime import datetime, timedelta
import os

def generate_visualization(data):
    try:
        # Extract and parse observed and forecasted data for plotting
        observed_data = data.get("observed", {}).get("data", [])
        forecast_data = data.get("forecast", {}).get("data", [])

        # Parse dates and values for primary and secondary observed data
        observed_dates = [isoparse(entry["validTime"]) for entry in observed_data]
        primary_observed = [entry["primary"] if entry["primary"] >= 0 else None for entry in observed_data]
        secondary_observed = [entry["secondary"] if entry["secondary"] >= 0 else None for entry in observed_data]

        # Check if any secondary values are between 0 and 1
        if any(0 < value < 1 for value in secondary_observed if value is not None):
            secondary_observed = [value * 1000 if value is not None else None for value in secondary_observed]
            secondary_unit = "Cubic feet / sec (cfs)"
        else:
            secondary_unit = "Cubic feet / sec x 1000 (kcfs)"

        # Parse dates and values for primary and secondary forecast data
        forecast_dates = [isoparse(entry["validTime"]) for entry in forecast_data]
        primary_forecast = [entry["primary"] if entry["primary"] >= 0 else None for entry in forecast_data]
        secondary_forecast = [entry["secondary"] if entry["secondary"] >= 0 else None for entry in forecast_data]

        if secondary_unit == 'Cubic feet / sec (cfs)':
            secondary_forecast = [value * 1000 if value is not None else None for value in secondary_forecast]

        # Determine the start date of forecast data for the segregation line
        if forecast_dates:
            start_forecast_date = forecast_dates[0]

        # Create Plotly graph objects for primary and secondary data
        fig_primary = go.Figure()
        fig_primary.add_trace(go.Scatter(
            x=observed_dates, y=primary_observed,
            mode='lines', name='Primary Observed',
            line=dict(color='black')
        ))
        fig_primary.add_trace(go.Scatter(
            x=forecast_dates, y=primary_forecast,
            mode='lines', name='Primary Forecast',
            line=dict(color='blue')
        ))

        # Add a vertical line at the start of forecast dates in the primary graph
        if forecast_dates:
            fig_primary.add_shape(
                type="line",
                x0=start_forecast_date, y0=0, x1=start_forecast_date, y1=1,
                xref="x", yref="paper",
                line=dict(color="red", width=2, dash="dash")
            )

        fig_primary.update_layout(
            title=f"{data['observed']['primaryName']} Over Time",
            xaxis_title="Time",
            yaxis_title=f"{data['observed']['primaryUnits']}"
        )

        fig_secondary = go.Figure()
        fig_secondary.add_trace(go.Scatter(
            x=observed_dates, y=secondary_observed,
            mode='lines', name='Secondary Observed',
            line=dict(color='gray')
        ))
        fig_secondary.add_trace(go.Scatter(
            x=forecast_dates, y=secondary_forecast,
            mode='lines', name='Secondary Forecast',
            line=dict(color='green')
        ))

        # Add a vertical line at the start of forecast dates in the secondary graph
        if forecast_dates:
            fig_secondary.add_shape(
                type="line",
                x0=start_forecast_date, y0=0, x1=start_forecast_date, y1=1,
                xref="x", yref="paper",
                line=dict(color="red", width=2, dash="dash")
            )

        fig_secondary.update_layout(
            title=f"{data['observed']['secondaryName']} Over Time",
            xaxis_title="Time",
            yaxis_title=f"{secondary_unit}"
        )

        # Convert figures to JSON
        fig_primary_json = fig_primary.to_json()
        fig_secondary_json = fig_secondary.to_json()

    except ValueError as e:
        print(f"Error parsing datetime: {e}")
        return f"Error parsing datetime: {e}"

    # Return the figures as JSON strings
    return fig_primary_json, fig_secondary_json
