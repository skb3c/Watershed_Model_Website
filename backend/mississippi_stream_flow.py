import os
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime



class Mississippi_visualization:

    def __init__(self, start_date,end_date,subBasinId,subBasinName):
        self.start_date= start_date
        self.end_date= end_date
        self.subBasinId = subBasinId
        self.subBasinName = subBasinName
    
    # Sample data
    def plot(self):
        startDate = pd.to_datetime('2010-01-01')
        x = pd.to_datetime(self.start_date)
        y = pd.to_datetime(self.end_date)

        d0 = pd.to_datetime(x)
        d1 = pd.to_datetime(y)


        startDate = datetime.strptime('01/01/2010', '%m/%d/%Y')
        x = datetime.strptime(self.start_date, '%m/%d/%Y')
        y = datetime.strptime(self.end_date, '%m/%d/%Y')

        startIndex = (x.year - startDate.year) * 12 + (x.month - startDate.month)
        endIndex = (y.year - startDate.year) * 12 + (y.month - startDate.month)

        base_url = os.environ.get('GCS_BASE_URL')
        # Load dataset
        file_path = ''
        if(self.subBasinName == 'arkansas'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_arkansas_sub5285_monthly_2010_to_2019.csv'  # Prod URL
        elif(self.subBasinName == 'lower_mississippi'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_lower_mississippi_sub2675_monthly_2010_to_2019.csv' # Prod URL
        elif(self.subBasinName == 'lower_missouri'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_lower_missouri_sub5835_monthly_2010_to_2019.csv' # Prod URL
        elif(self.subBasinName == 'ohio'):
            file_path =  f'{base_url}/mississippi_flows_monthly_2010_2019/flow_ohio_sub3139_monthly_2010_to_2019.csv' # Prod URL
        elif(self.subBasinName == 'tennessee'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_tennessee_sub904_monthly_2010_to_2019.csv' # Prod URL
        elif(self.subBasinName == 'upper_mississippi'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_upper_mississippi_sub2675_monthly_2010_to_2019.csv' # Prod URL
        elif(self.subBasinName == 'upper_missouri'):
            file_path = f'{base_url}/mississippi_flows_monthly_2010_2019/flow_upper_missouri_sub6977_monthly_2010_to_2019.csv' # Prod URL
            
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            raise ValueError('Error occurred while reading csv file ')
        # df = pd.read_csv('/Users/yuvateja/Downloads/Missouri_WaterShed/backend/data/flow_daily_2000_to_2019.csv')
        

        #subbasin_id
        sub_val = 'rch_' + self.subBasinId

        # Extract relevant data based on date range
        x = df[sub_val]
        y = pd.DataFrame()
        y['stream data'] = x.iloc[startIndex:endIndex + 1]
        y['date'] = pd.date_range(start=d0, periods=len(y), freq='M')

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
        fig.update_layout(title=' Monthly Stream Flow at subBasin: ' + self.subBasinName +' & Location ID: ' + sub_val[4:],
                        xaxis_title='Date',
                        yaxis_title='Stream Flow (m3/s)',
                        xaxis=dict(tickformat="%Y-%b-%d", tickangle=45),
                        hovermode='x unified',
                        legend=dict(orientation='h', yanchor='top', y=1.10, xanchor='right', x=1))

        # Return the plot
        return fig