import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from stream_flow_visualizations import Visualization
from dotenv import load_dotenv
from precipitation import precipitation
from evapotranspiration import evapotranspiration
from climateIndices import climateIndices
from temperature import temperature
from mississippi_stream_flow import Mississippi_visualization
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from flask_mail import Mail, Message
from openai import OpenAI
import requests
import products  # Import the visualization file
import json
import stageFlow
import combined
import logging

load_dotenv()  

app = Flask(__name__)

CORS(app)

# app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')  # Your email address
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')  # Your email password
mail = Mail(app)



jwt = JWTManager(app)


@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/api/stream_flow_visualization', methods=["POST"])

def stream_flow_visualization():
    # Retrieve data from your database
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            startDate = requestJson.get('startDate')
            endDate = requestJson.get('endDate')
            basinId = requestJson.get('basinId')

            if startDate is None or endDate is None or basinId is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            objects = Visualization(startDate, endDate, basinId)
            fig = objects.plot()
            fig_asJson = fig.to_json()

            
            return jsonify({"image" : fig_asJson, "basinId" : basinId, "startDate": startDate, "endDate": endDate})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
        
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500
    

@app.route('/api/precipitation_visualization', methods=["POST"])

def precipitation_visualization():
    # Retrieve data from your database
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            startDate = requestJson.get('startDate')
            endDate = requestJson.get('endDate')
            latitude = requestJson.get('latitude')
            longitude = requestJson.get('longitude')

            if startDate is None or endDate is None or latitude is None or longitude is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            objects = precipitation(startDate, endDate, latitude,longitude)
            fig = objects.plot()
            fig_asJson = fig.to_json()

            
            return jsonify({"image" : fig_asJson, "latitude" : latitude, "longitude" : longitude, "startDate": startDate, "endDate": endDate})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
        
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500


@app.route('/api/evapotranspiration_visualization', methods=["POST"])

def evapotranspiration_visualization():
    # Retrieve data from your database
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            startDate = requestJson.get('startDate')
            endDate = requestJson.get('endDate')
            latitude = requestJson.get('latitude')  
            longitude = requestJson.get('longitude')
            print("in server.py evaporations: " + startDate + endDate + latitude + longitude)
            if startDate is None or endDate is None or latitude is None or longitude is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            objects = evapotranspiration(startDate, endDate, latitude,longitude)
            fig = objects.plot()
            fig_asJson = fig.to_json()

            
            return jsonify({"image" : fig_asJson, "latitude" : latitude, "longitude" : longitude, "startDate": startDate, "endDate": endDate})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
        
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500

    

@app.route('/api/Climate_Indices_Visualization', methods=["POST"])

def climate_indices_visualization():
    # Retrieve data from your database
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            latitude = requestJson.get('latitude')
            longitude = requestJson.get('longitude')
            SDII = requestJson.get('SDII')
            RX5 = requestJson.get('RX5')
            RR1 = requestJson.get('RR1')
            RX1 = requestJson.get('RX1')
            R10 = requestJson.get('R10')
            R20 = requestJson.get('R20')
            PRCPTOT = requestJson.get('PRCPTOT')
            CDD = requestJson.get('CDD')
            CWD = requestJson.get('CWD')

            if latitude is None or longitude is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            objects = climateIndices(latitude, longitude, SDII, RX5, RR1, RX1, R10, R20, PRCPTOT, CDD, CWD)
            response = objects.plot()
            #response_json = json.dumps(response)
            
            return jsonify({"images" : response, "latitude" : latitude, "longitude" : longitude})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500


@app.route('/api/submitForm', methods=['POST'])

def submit_form():
    try:
        data = request.json  # Get JSON data from the request body
        # print('Received form data:', data)

        # Create an email message
        msg = Message('New Form Submission',
                      sender=os.environ.get('EMAIL_USER'),
                      recipients=['mizhydrologylab@gmail.com'])
        msg.body = f"New feedback submission:\n\nFirst Name: {data['firstName']}\nLast Name: {data['lastName']}\nEmail: {data['email']}\nFeedback: {data['feedback']}"
        mail.send(msg)

        return jsonify({'message': 'Form submitted successfully'}), 200
    except Exception as e:
        error_message = str(e)
        print('Error processing form data:', error_message)
        return jsonify({'error': error_message}), 500

@app.route('/api/temperature_visualization', methods=["POST"])

def temperature_visualization():
    # Retrieve data from your database
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            startDate = requestJson.get('startDate')
            endDate = requestJson.get('endDate')
            latitude = requestJson.get('latitude')
            longitude = requestJson.get('longitude')

            if startDate is None or endDate is None or latitude is None or longitude is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            objects = temperature(startDate, endDate, latitude,longitude)
            fig = objects.plot()
            fig_asJson = fig.to_json()

            
            return jsonify({"image" : fig_asJson, "latitude" : latitude, "longitude" : longitude, "startDate": startDate, "endDate": endDate})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
        
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500
    

@app.route('/api/mississippi/stream_flow_visualization', methods=["POST"])

def mississippi_stream_flow_visualization():
    try:
        if request.method == 'POST' and request.is_json:
            requestJson = request.get_json()
            startDate = requestJson.get('startDate')
            endDate = requestJson.get('endDate')
            basinId = requestJson.get('basinId')
            subBasinName = requestJson.get('subBasinName')

            if startDate is None or endDate is None or basinId is None:
                return jsonify({"error" :400 , "errorMessage": "Payload is not correct"})
            
            if subBasinName != 'arkansas' and subBasinName != 'lower_mississippi' and subBasinName != 'lower_missouri' and subBasinName != 'ohio' and subBasinName != 'tennessee' and subBasinName != 'upper_mississippi' and subBasinName != 'upper_missouri':
                return jsonify({"error" :500 , "errorMessage": "subBasinName is not correct"})
            
            objects = Mississippi_visualization(startDate, endDate, basinId, subBasinName)
            fig = objects.plot()
            fig_asJson = fig.to_json()

            
            return jsonify({"image" : fig_asJson, "basinId" : basinId, "startDate": startDate, "endDate": endDate})
            
        
        else:
            return jsonify({"error" :400 , "errorMessage": "Bad request"})
        
    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500
    

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Set your API key securely in env or directly (not recommended)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

@app.route('/api/chat', methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' in request body"}), 400

        user_message = data['message']
        logger.info(f"Received chat message: {user_message}")

        # 1. Try with file_search (RAG)
        rag_response = client.responses.create(
            model="gpt-4.1-nano",
            input=user_message,
            tools=[{
                "type": "file_search",
                "vector_store_ids": ["vs_683695a671a4819186af18287de8b358"]
            }]
        )

        # 2. Extract RAG answer
        try:
            rag_answer = rag_response.output[1].content[0].text.strip()
        except Exception:
            rag_answer = ""

        # 3. If RAG fails or is too vague, fall back to GPT general knowledge
        fallback_needed = (
            not rag_answer or
            "I recommend checking a reliable weather service" in rag_answer or
            "I couldn't find" in rag_answer
        )

        if fallback_needed:
            logger.info("Fallback to GPT-4-turbo due to insufficient RAG response.")
            chat_response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that can answer both from uploaded documents and general world knowledge like weather, history, and science."},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            final_answer = chat_response.choices[0].message.content.strip()
        else:
            final_answer = rag_answer

        return jsonify({"response": final_answer})

    except Exception as e:
        logger.error(f"Error in /api/chat: {e}", exc_info=True)
        return jsonify({
            "error": "An error occurred",
            "details": str(e)
        }), 500
    
@app.route('/api/check', methods=["GET"])
# @jwt_required()
def check():
    try:
        # Path to your local JSON file
        file_path = 'F:/Agro_Water_Shed/NEW_WEBSITE/git_push/Watershed_Model_Website/backend/data/subset_usaLid_rch.json'
        # filepath = ""
        
        # Debug: Check if the file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'File does not exist'}), 404
        
        # Open and read the JSON file
        with open(file_path, 'r') as json_file:
            response_data = json.load(json_file)  # Load the JSON data

        # Return the JSON content as the response
        return jsonify(response_data), 200

    except FileNotFoundError:
        error_message = {'error': 'File not found'}
        return jsonify(error_message), 404

    except Exception as e:
        error_message = {'error': str(e)}
        return jsonify(error_message), 500


    
@app.route('/api/getReachId/<lid>', methods=['GET'])
# @jwt_required()
def get_reach_id(lid):  # Ensure 'lid' is passed as an argument
    url = f"https://api.water.noaa.gov/nwps/v1/gauges/{lid}"

    try:
        # Make a GET request to the NOAA API
        response = requests.get(url)

        # Check if the response is successful
        if response.ok:
            return jsonify(response.json()), 200  # Return the NOAA API response as JSON
        else:
            return jsonify({'error': 'No data found for the provided lid'}), 404  # Handle case when no data is found
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Handle other exceptions



@app.route('/api/getProduct/<lid>/<pedts>/<rch_ID>', methods=['GET'])
# @jwt_required()
def get_product(lid, pedts ,rch_ID):  # Ensure 'lid' and 'pedts' are passed as arguments
    url = f"https://api.water.noaa.gov/nwps/v1/products/stageflow/{lid}/{pedts}"

    try:
        # Make a GET request to the NOAA API
        response = requests.get(url)

        # Check if the response is successful
        if response.ok:
            data = response.json()

            # Generate and return the two visualizations as JSON
            plot_primary_json, plot_secondary_json = products.generate_visualization(data,rch_ID)

            return jsonify({
                "primary_image": plot_primary_json,
                "secondary_image": plot_secondary_json
            }), 200

        else:
            return jsonify({'error': 'No data found for the provided lid and pedts'}), 404  # Handle case when no data is found
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Handle other exceptions


@app.route('/api/stageflow/<lid>', methods=['GET'])
# @jwt_required()
def get_stageflow(lid):  # Ensure 'lid' and 'pedts' are passed as arguments
    url = f"https://api.water.noaa.gov/nwps/v1/gauges/{lid}/stageflow"
    try:
        # Make a GET request to the NOAA API
        response = requests.get(url)

        # Check if the response is successful
        if response.ok:
            data = response.json() # Return the NOAA API response as JSON
            plot_primary_json, plot_secondary_json = stageFlow.generate_visualization(data)

            return jsonify({
                "primary_image": plot_primary_json,
                "secondary_image": plot_secondary_json
            }), 200

        
        else:
            return jsonify({'error': 'No data found for the provided lid'}), 404  # Handle case when no data is found
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Handle other exceptions

@app.route('/api/combined/<lid>/<rch_ID>', methods=['GET'])
# @jwt_required()
def get_combined(lid, rch_ID):  # Ensure parameter names match the route
    print("lid combined", lid)
    url = f"https://api.water.noaa.gov/nwps/v1/gauges/{lid}/stageflow"
    try:
        response = requests.get(url)
        if response.ok:
            data = response.json()
            plot_primary_json, plot_secondary_json = combined.generate_visualization_combined(data, rch_ID)
            return jsonify({
                "primary_image": plot_primary_json,
                "secondary_image": plot_secondary_json
            }), 200
        else:
            return jsonify({'error': 'No data found for the provided lid'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

      
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

