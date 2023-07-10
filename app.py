from flask import render_template, jsonify, Flask, request, make_response
import os
import json
import random
from model import Patient, DISEASES


app = Flask(__name__, template_folder='templates', static_folder='static')


# Initialize a demo VAIP patient  
# to be replaced by generated VAIP patient  
p = Patient()




def generate_random_range(x, y):
    x_random = random.randint(x, int(y/2))
    y_random = random.randint(x_random+1, y)
    return [x_random, y_random]


@app.route('/', methods=["GET"])
def index():
    # Home screen
    return render_template('index.html')


@app.route('/generate', methods=["POST"])
def generate():
    global p
    disease = DISEASES[random.randint(0, len(DISEASES)-1)]["disease"]
    # disease = "Pneumonia"
    print(disease)
    # Generate a demo VAIP patient  
    p = Patient(disease=disease)

    # Generate a patient info
    patient = p.get_info()
    try:

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
            "disease":"disease",
            "message": str(e),
            "patient": patient
        }
        return jsonify(response)




@app.route('/chat', methods=["POST"])
def chat():
    messages = []
    try:

        # print('patient class', p)


        form_data = request.json
        messages = list(form_data["messages"])
        patient_info = dict(form_data["patient_info"])
        disease = form_data["disease"]
        print("chat disease", disease)
        print("patient_info age", patient_info['age'])
        p.disease = disease
        p.patient_info = patient_info
        p.update_chat_prompt()
        response_messages = p.chat(messages)

        response = {
            "success": True,
            "response": response_messages,
            "answer": response_messages[-1]["content"],
        }
        return jsonify(response)
    except Exception as e:
        errorMessage = str(e)
        errorMessage = "Patient not exist yet" if errorMessage == "'str' object has no attribute 'chat'" else errorMessage
        print(e)
        
        messages.append({
            "role":"assistant", "content":"i couldn't get you, check console.."
        })
        response = {
            "error": True,
            "message": errorMessage,
            "response": messages,
            # "answer": "i couldn't get you, check console..",
            "answer": "server error says \n"+errorMessage,
        }
        return jsonify(response)


@app.route('/diseases')
def diseases():
    from model import DISEASES

    return jsonify(DISEASES)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
