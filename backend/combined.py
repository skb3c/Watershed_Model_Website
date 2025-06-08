import os
import glob
import pandas as pd
import plotly.graph_objs as go
from dateutil.parser import isoparse
import plotly.colors as pc

# Function to load and process each CSV file in the folder
def load_csv_data_all_files(observed_dates, forecast_dates, rch_id, folder_path):
    all_data = []
    # Combine observed and forecast dates
    date_range = observed_dates + forecast_dates
    date_range_only = [date.date() for date in date_range]  # Convert to date format

    for filepath in glob.glob(os.path.join(folder_path, '*.csv')):
        try:
            df = pd.read_csv(filepath)
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
            
            # Filter rows based on combined date range
            df_filtered = df[df['Date'].isin(date_range_only)]
            
            # Check if rch_id exists in the columns
            if rch_id in df_filtered.columns:
                # Convert CMS to CFS
                df_filtered[rch_id] = df_filtered[rch_id] * 35.3147  # conversion factor
                
                # Rename the rch_id column to include the source filename for uniqueness
                source_name = os.path.splitext(os.path.basename(filepath))[0]  # Extract filename without extension
                new_col_name = f"{rch_id}_{source_name}"
                df_filtered = df_filtered.rename(columns={rch_id: new_col_name})
                
                # Append only Date and the renamed rch_id column
                all_data.append(df_filtered[['Date', new_col_name]])
            else:
                print(f"rch_ID {rch_id} not found in file {filepath}")
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
    
    if not all_data:
        print("No data loaded. Check rch_id and CSV files.")
        return pd.DataFrame()
    
    # Combine all data on Date using outer join to include all dates
    combined_df = all_data[0]
    for df in all_data[1:]:
        combined_df = pd.merge(combined_df, df, on='Date', how='outer')
    
    # Sort by Date
    combined_df = combined_df.sort_values('Date')
    
    # Fill NaN values if necessary (optional)
    combined_df.fillna(method='ffill', inplace=True)
    combined_df.fillna(method='bfill', inplace=True)
    
    # Calculate the mean across all rch_id columns
    rch_columns = [col for col in combined_df.columns if col != 'Date']
    combined_df['Mean'] = combined_df[rch_columns].mean(axis=1)
    
    print("Combined CSV data with Mean:\n", combined_df)
    
    return combined_df

# Visualization function with added data processing for all files
def generate_visualization_combined(data, rch_id):
    try:
        # Extract observed and forecasted data for plotting
        observed_data = data.get("observed", {}).get("data", [])
        forecast_data = data.get("forecast", {}).get("data", [])
        
        # Parse dates and values for primary and secondary observed data
        observed_dates = [isoparse(entry["validTime"]) for entry in observed_data]
        primary_observed = [entry["primary"] if entry["primary"] >= 0 else None for entry in observed_data]
        secondary_observed = [entry["secondary"] if entry["secondary"] >= 0 else None for entry in observed_data]

        print("secondary_observed:", secondary_observed)
        
        # Check if secondary values need scaling
        if any(0 < value < 1 for value in secondary_observed if value is not None):
            secondary_observed = [value * 1000 if value is not None else None for value in secondary_observed]
            secondary_unit = "Cubic feet / sec (cfs)"
        else:
            secondary_unit = "Cubic feet / sec x 1000 (kcfs)"

        # Parse forecast dates and values
        forecast_dates = [isoparse(entry["validTime"]) for entry in forecast_data]
        primary_forecast = [entry["primary"] if entry["primary"] >= 0 else None for entry in forecast_data]
        secondary_forecast = [entry["secondary"] if entry["secondary"] >= 0 else None for entry in forecast_data]

        # Scale secondary forecast data if necessary
        if secondary_unit == 'Cubic feet / sec (cfs)':
            secondary_forecast = [value * 1000 if value is not None else None for value in secondary_forecast]

        # Define the folder path for CSV files
        folder_path = '/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/Noaa/forecasted_data'

        # Load CSV data for secondary graph
        df_csv_all = load_csv_data_all_files(observed_dates, forecast_dates, rch_id, folder_path)
        if df_csv_all.empty:
            print("No CSV data available for plotting.")
            return None, None
        
        # Set up unique colors for each file using Plotly's qualitative palette
        colors = pc.qualitative.Plotly
        color_count = len(colors)

        # Plot primary data
        fig_primary = go.Figure()
        fig_primary.add_trace(go.Scatter(
            x=observed_dates, y=primary_observed,
            mode='lines', name='Primary Observed',
            line=dict(color='blue')
        ))
        fig_primary.add_trace(go.Scatter(
            x=forecast_dates, y=primary_forecast,
            mode='lines', name='Primary Forecast',
            line=dict(color='orange')  # Changed forecast color to orange
        ))

        # Add vertical line at the start of forecast dates in primary graph
        if forecast_dates:
            start_forecast_date = forecast_dates[0]
            fig_primary.add_shape(
                type="line",
                x0=start_forecast_date, y0=0, x1=start_forecast_date, y1=1,
                xref="x", yref="paper",
                line=dict(color="white", width=2, dash="dash")
            )

        fig_primary.update_layout(
            title=f"{data['observed']['primaryName']} Over Time",
            xaxis_title="Time",
            yaxis_title=f"{data['observed']['primaryUnits']}",
            xaxis=dict(tickformat="%b %d, %H:%M"),
            template='plotly_dark'  # Optional: Use dark theme
        )

        # Plot secondary data including CSV data for all files
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

        # Add vertical line at the start of forecast dates in secondary graph
        if forecast_dates:
            fig_secondary.add_shape(
                type="line",
                x0=start_forecast_date, y0=0, x1=start_forecast_date, y1=1,
                xref="x", yref="paper",
                line=dict(color="white", width=2, dash="dash")
            )

        # Plot each CSV file's data with unique colors and dashed lines
        rch_columns = [col for col in df_csv_all.columns if col not in ['Date', 'Mean']]
        for i, col in enumerate(rch_columns):
            fig_secondary.add_trace(go.Scatter(
                x=df_csv_all['Date'], y=df_csv_all[col],
                mode='lines', name=f'{col} (Channel)',
                line=dict(color=colors[i % color_count], dash='dash')
            ))

        # Plot mean line in dark blue and thicker
        fig_secondary.add_trace(go.Scatter(
            x=df_csv_all['Date'], y=df_csv_all['Mean'],
            mode='lines', name='Mean (All Files)',
            line=dict(color='darkblue', width=3)
        ))

        fig_secondary.update_layout(
            title=f"{data['observed']['secondaryName']} Over Time",
            xaxis_title="Time",
            yaxis_title=f"{secondary_unit}",
            xaxis=dict(tickformat="%b %d, %H:%M"),
            template='plotly_dark'  # Optional: Use dark theme
        )

        # Convert figures to JSON
        fig_primary_json = fig_primary.to_json()
        fig_secondary_json = fig_secondary.to_json()

    except ValueError as e:
        print(f"Error parsing datetime: {e}")
        return f"Error parsing datetime: {e}"

    return fig_primary_json, fig_secondary_json
