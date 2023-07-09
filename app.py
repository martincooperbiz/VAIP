from flask import render_template, jsonify, Flask, request, make_response
import os
import json
import random
from model import Patient, DISEASES


app = Flask(__name__, template_folder='templates', static_folder='static')

p = "patient_class"

def generate_random_range(x, y):
    x_random = random.randint(x, int(y/2))
    y_random = random.randint(x_random+1, y)
    return [x_random, y_random]


@app.route('/', methods=["GET"])
def index():
    global p 
    p = "patient_class"
    return render_template('index.html')

@app.route('/generate', methods=["POST"])
def generate():
    global p
    disease = DISEASES[random.randint(0, len(DISEASES)-1)]
    # disease = "Pneumonia"
    print(disease)
    p = Patient(disease=disease)
    patient = p.get_info()
    try :

        patient = p.get_info()
        symptoms = p.get_symptoms()
        hotspots = p.get_hotspots()


        i = 2
        for hotspot in hotspots:
            hotspot['id'] = "hotspot-"+str(i)
            i += 1
        
        example_patient = {
            "chief-complaint": "I've been experiencing a persistent cough accompanied by difficulty breathing, fatigue, and chest pain. The cough feels deep and phlegm-filled, making it hard for me to get a good night's sleep. I've also noticed a high fever, chills, and a general feeling of weakness. Overall, I'm concerned about my respiratory symptoms and their impact on my daily activities."
        }
        response = {
            "symptoms": symptoms,
            "disease": disease,
            "hotspots": hotspots,
            "patient": patient
        }
        return jsonify(response)
    

    except Exception as e:
        response = {
            "error": True,
            "message": str(e),
            "patient": patient
        }
        return jsonify(response)

@app.route('/chat', methods=["GET"])
def get_chat():
    global p
    return jsonify({
        "message":True,
        "class": str(p)
    })


@app.route('/chat', methods=["POST"])
def chat():
    try:

        print('patient class', p)

        form_data = request.form
        patient = form_data["patient"]
        disease = form_data["disease"]

        response = {
            "error": True,
            "message": str(e),
            "patient": "patient",
            "class": str(p)
        }
        return jsonify(response)
    except Exception as e:
        response = {
            "error": True,
            "message": str(e),
            "patient": "patient"
        }
        return jsonify(response)

@app.route('/diseases')
def diseases():
    from model import DISEASES

    return jsonify(DISEASES)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
