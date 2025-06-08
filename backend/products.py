import plotly.graph_objs as go
from dateutil.parser import isoparse
import pandas as pd
from datetime import datetime, timedelta
import os

def load_forecast_data(file_paths):
    combined_data = pd.DataFrame()
    for file_path in file_paths:
        try:
            temp_df = pd.read_csv(file_path)
            temp_df['Date'] = pd.to_datetime(temp_df['Date'], format='%Y-%m-%d')
            temp_df['Source'] = os.path.basename(file_path)
            combined_data = pd.concat([combined_data, temp_df], ignore_index=True)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
    return combined_data

def generate_visualization(data, rch_ID):
    print("rch_ID", rch_ID)

    try:
        forecast_dir = '/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/Noaa/forecasted_data/'
        forecast_files = [os.path.join(forecast_dir, f) for f in os.listdir(forecast_dir) if f.endswith('.csv')]
        forecast_data = load_forecast_data(forecast_files)
        
        current_date = datetime.now()
        future_data_df = forecast_data[(forecast_data['Date'] > current_date) & 
                                       (forecast_data['Date'] <= current_date + timedelta(days=10))]

        if rch_ID not in forecast_data.columns:
            return f"Error: rch_ID {rch_ID} not found in the CSV data."

        fig_primary = go.Figure()
        colors = ['blue', 'orange', 'green', 'red', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan']
        x_values = [isoparse(entry["validTime"]) for entry in data["data"]]
        y_primary = [entry["primary"] if entry["primary"] >= 0 else None for entry in data["data"]]

        fig_primary.add_trace(go.Scatter(
            x=x_values, 
            y=y_primary, 
            mode='lines', 
            name='Primary (Observed)',
            line=dict(color='black', width=3)
        ))

        fig_primary.update_layout(
            title=f'{data["primaryName"]} Over Time',
            xaxis_title='Time',
            yaxis_title=f'{data["primaryName"]} ({data["primaryUnits"]})',
            xaxis=dict(tickformat="%b %d, %H:%M"),
            width=1200,
            template='plotly'
        )

        fig_secondary = go.Figure()

        y_secondary = [entry["secondary"] if entry["secondary"] >= 0 else None for entry in data["data"]]

# Determine the secondary unit/ Initially they are in kcfs
        if any(0 < value < 1 for value in y_secondary if value is not None):
            y_secondary = [value * 1000 if value is not None else None for value in y_secondary]
            secondary_unit = "Cubic feet / sec (cfs)"
        else:
            secondary_unit = "Cubic feet / sec x 1000 (kcfs)"

# Add the primary trace
        fig_secondary.add_trace(go.Scatter(x=x_values, y=y_secondary, mode='lines', name='Secondary'))

# Iterate through future data and convert to appropriate units
        for i, source in enumerate(future_data_df['Source'].unique()):
            source_data = future_data_df[future_data_df['Source'] == source]
            future_x_values = source_data['Date']
    
    # Conversion logic based on secondary_unit
            if secondary_unit == "Cubic feet / sec (cfs)":
                future_y_values = source_data[rch_ID].apply(lambda x: x * 35.3147 if x >= 0 else None)
            else:  # "Cubic feet / sec x 1000 (kcfs)"
                future_y_values = source_data[rch_ID].apply(lambda x: x * 0.0353147 if x >= 0 else None)

    # Add the trace for future data
            fig_secondary.add_trace(go.Scatter(
                x=future_x_values, 
                y=future_y_values, 
                mode='lines', 
                name=f"Forecast from {source}",
                line=dict(color=colors[i % len(colors)])
            ))

        

        # Adding the vertical line for the start of forecast data
        if future_data_df['Date'].min():
            start_forecast_date = future_data_df['Date'].min()
            fig_secondary.add_shape(
                type="line",
                x0=start_forecast_date, y0=0, x1=start_forecast_date, y1=1,
                xref="x", yref="paper",
                line=dict(color="red", width=2, dash="dash")
            )

        fig_secondary.update_layout(
            title=f'{data["secondaryName"]} Over Time',
            xaxis_title='Time',
            yaxis_title=secondary_unit,
            xaxis=dict(tickformat="%b %d, %H:%M"),
            width=1200,
            template='plotly'
        )

    except ValueError as e:
        print(f"Error parsing datetime: {e}")
        return f"Error parsing datetime: {e}"

    return fig_primary.to_json(), fig_secondary.to_json()
