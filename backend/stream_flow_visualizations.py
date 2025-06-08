import pandas as pd
import plotly.graph_objects as go

class Visualization:

    def __init__(self, start_date,end_date,subBasinId):
        self.start_date= start_date
        self.end_date= end_date
        self.subBasinId= subBasinId
    
    # Sample data
    def plot(self):
        startDate = pd.to_datetime('2000-01-01')
        x = pd.to_datetime(self.start_date)
        y = pd.to_datetime(self.end_date)
        d0 = pd.to_datetime(x)
        d1 = pd.to_datetime(y)
        delta = d1 - d0

        alpha = d0 - startDate
        beta = d1 - startDate

        startIndex = alpha.days
        endIndex = beta.days

        # Load dataset
        # Prod URL
        df = pd.read_csv('https://storage.googleapis.com/miz_hydrology/Backend_Data/MO_Hydrology_strem_flow/flow_daily_2000_to_2019.csv')
        # df = pd.read_csv('/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/flow_daily_2000_to_2019.csv')
        

        #subbasin_id
        sub_val = 'rch_' + self.subBasinId

        # Extract relevant data based on date range
        x = df[sub_val]
        y = pd.DataFrame()
        y['stream data'] = x.iloc[startIndex:endIndex + 1]
        y['date'] = pd.date_range(start=d0, periods=len(y), freq='D')

        # Calculate mean and standard deviation for the entire dataset
        mean_value = df[sub_val].mean()
        std_deviation = df[sub_val].std()

        # Create the figure
        fig = go.Figure()

        # Add the line trace for the data
        fig.add_trace(go.Scatter(x=y['date'], y=y['stream data'], mode='lines', name='Stream Flow'))

        # Add mean line
        fig.add_shape(type='line',
                    x0=min(y['date']),
                    y0=mean_value,
                    x1=max(y['date']),
                    y1=mean_value,
                    line=dict(color='green', width=2),
                    name=f'Mean: {mean_value:.2f}')

        # Add standard deviation lines
        fig.add_shape(type='line',
                    x0=min(y['date']),
                    y0=mean_value + std_deviation,
                    x1=max(y['date']),
                    y1=mean_value + std_deviation,
                    line=dict(color='red', width=2, dash='dashdot'))

        fig.add_shape(type='line',
                    x0=min(y['date']),
                    y0=mean_value + 2*std_deviation,
                    x1=max(y['date']),
                    y1=mean_value + 2*std_deviation,
                    line=dict(color='red', width=2, dash='dashdot'))

        # Add dummy traces for legend
        fig.add_trace(go.Scatter(x=[None], y=[None], mode='markers', marker=dict(color='green'), 
                                name=f'Mean River Flow: {mean_value:.2f}'+ '(m3/s)'))

        fig.add_trace(go.Scatter(x=[None], y=[None], mode='lines', line=dict(color='red', dash='dashdot'), 
                                name=f"Std Dev: { std_deviation:.2f}"+ '(m3/s)'))

        # Update layout
        fig.update_layout(title='Daily Stream Flow at Location ID' + sub_val[4:],
                        xaxis_title='Date',
                        yaxis_title='Stream Flow (m3/s)',
                        xaxis=dict(tickformat="%Y-%b-%d", tickangle=45),
                        hovermode='x unified',
                        legend=dict(orientation='h', yanchor='top', y=1.10, xanchor='right', x=1))

        # Return the plot
        return fig