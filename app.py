from flask import render_template, jsonify, Flask, redirect, url_for, request, make_response
import os
import json
import random
from model import Patient, DISEASES


app = Flask(__name__, template_folder='templates', static_folder='static')


def generate_random_range(x, y):
    x_random = random.randint(x, int(y/2))
    y_random = random.randint(x_random+1, y)
    return [x_random, y_random]


@app.route('/', methods=["GET"])
def index(): 
    return render_template('index.html')

@app.route('/generate', methods=["POST"])
def generate():
    disease = DISEASES[random.randint(0, len(DISEASES))]
    disease = "Pneumonia"
    print(disease)

    p = Patient(disease=disease)

    patient = p.get_info()
    symptoms = p.get_symptoms()
    hotspots = p.get_hotspots()

    # with open('hotspots.json', 'r') as file:
    #     data = file.read()
    #     hotspots = json.loads(data)

    i = 2
    for hotspot in hotspots:
        hotspot['id'] = "hotspot-"+str(i)
        i += 1
    # range = generate_random_range(0, len(hotspots))
    # print("range", range)
    # start, end = range
    # newhotspots = hotspots[start: end]
    example_patient = {
        "chief-complaint": "I've been experiencing a persistent cough accompanied by difficulty breathing, fatigue, and chest pain. The cough feels deep and phlegm-filled, making it hard for me to get a good night's sleep. I've also noticed a high fever, chills, and a general feeling of weakness. Overall, I'm concerned about my respiratory symptoms and their impact on my daily activities."
    }
    response = {
        # "range": range,
        "symptoms": symptoms,
        "disease": disease,
        "hotspots": hotspots,
        "patient": patient
    }
    return jsonify(response)


@app.route('/d')
def diseases():
    from model import DISEASES

    return jsonify(DISEASES)


if __name__ == "__main__":
    # import subprocess

    # subprocess.run(["gunicorn", "app:app", "--reload"])
    app.run(debug=True, port=5000)
