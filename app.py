from flask import render_template, jsonify, Flask, request, make_response, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import firebase_admin
from firebase_admin import credentials, auth, firestore
from functools import wraps
from oauthlib.oauth2 import WebApplicationClient
import requests
import os
import json
import random
from functions import is_valid_email
from model import Patient, DISEASES, User, db

path = "etc/secrets"
with open(path+"/client_secret.json", "r") as f:
    read = f.read()
    web = json.loads(read)
    web = web["web"]

# Configuration
GOOGLE_CLIENT_ID = web['client_id']
GOOGLE_CLIENT_SECRET = web['client_secret']
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)


# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)


# Initialize Flask Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id, name="name", email="email", profile_pic="https://cdn.vectorstock.com/i/preview-1x/20/76/man-avatar-profile-vector-21372076.jpg"):
    user = User(user_id, name=name, email=email, profile_pic=profile_pic)
    # return user.get_id()
    return user


# Initialize a demo VAIP patient
# to be replaced by generated VAIP patient
p = Patient()


def generate_random_range(x, y):
    x_random = random.randint(x, int(y/2))
    y_random = random.randint(x_random+1, y)
    return [x_random, y_random]


@app.route('/', methods=["GET"])
# @login_required
def index():
    if current_user.is_authenticated:
        user_data = current_user.get_data()
        print("is_authenticated")
        print(current_user.is_authenticated)
    # Home screen
        return render_template('index.html', user_data=user_data)
    # print(current_user)
    else:
        return render_template('index.html')


@app.route('/dashboard', methods=["GET"])
@login_required
def dashboard():
    if current_user.is_authenticated:
        print(current_user.get_data())
        user_data = current_user.get_data()
        # user_data['password'] = "*******"
    # Home screen
    return render_template('dashboard.html', user_data=user_data)


@app.route('/signup', methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        print("current_user", current_user)
        return redirect(url_for('dashboard'))
    else:
        if request.method == 'POST':

            form_data = request.form.to_dict()
            print(form_data)
            username = form_data['username']
            email = form_data['email']
            password = form_data['password']
            confirm_password = form_data['password']

            for key, value in form_data.items():
                if value == "":
                    return render_template('signup.html', error=f'Invalid {key} value provided', form_data=form_data)

            # 3, 15
            if len(username) < 3 or len(username) > 15:
                return render_template('signup.html', error='Username must be at least 3 characters, and les than 16 characters', form_data=form_data)

            if not is_valid_email(email):
                return render_template('signup.html', error='Invalid email provided', form_data=form_data)

            if confirm_password != password:
                return render_template('signup.html', error='Passwords do not match', form_data=form_data)

            # return render_template('signup.html', error=f'every thing is ok', form_data=form_data)
            try:

                create_user = auth.create_user(
                    email=email,
                    password=password,
                    display_name=username,
                )
                print(create_user)
                # query.where(field_path="field_name", op_string=="==", value)

                user = db.collection('users').where(
                    field_path='email', op_string='==', value=email).limit(1).stream()
                # user email already exist
                for doc in user:
                    return render_template('signup.html', error='Email already exists', form_data=form_data)
                new_user = {
                    'email': email,
                    'password': password,
                    'username': username,
                    'profile_pic': "https://cdn.vectorstock.com/i/preview-1x/20/76/man-avatar-profile-vector-21372076.jpg"
                }
                user_ref = db.collection('users').document()
                user_ref.set(new_user)
                user_obj = User(user_id=user_ref.id,
                                name=username, 
                                email=email,
                                profile_pic=new_user['profile_pic']
                                )
                login_user(user_obj)
                return redirect(url_for('dashboard'))

            except auth.EmailAlreadyExistsError:

                return render_template('signup.html', error='Auth Email already exists', form_data=form_data)
                return {
                    "access": False,
                    "error": True,
                    "message": "EmailAlreadyExistsError"
                }

            except Exception as e:
                return render_template('signup.html', error=f'Unknown error says {str(e)}', form_data=form_data)
                return {
                    "access": False,
                    "error": True,
                    "message": str(e)
                }

        return render_template('signup.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        # Validate guest login
        print("guest_login", request.form.get("guest_login"))
        if request.form.get("guest_login"):
            uid = "cFY6cIwCtP8Hbrwz2jqR"  # Unique ID for guest user
            display_name = "Guest"
            user_obj = User(user_id=uid, name=display_name, email="guest@vaip.me")
            login_user(user_obj)
            return redirect(url_for("dashboard"))
        else:
            form_data = request.form.to_dict()
            username = form_data['username']
            password = form_data['password']
            user = db.collection('users').where(
                field_path='email', op_string='==', value=username).limit(1).stream()
            for doc in user:
                user_data = doc.to_dict()
                if user_data['password'] == password:
                    unique_id = doc.id
                    print(user_data)
                    users_email = user_data["email"]
                    try:

                        picture = user_data["picture"]
                    except:
                        picture = "https://cdn.vectorstock.com/i/preview-1x/20/76/man-avatar-profile-vector-21372076.jpg"

                    users_name = user_data["username"]
                    user_obj = User(
                        user_id=unique_id, name=users_name, email=users_email, profile_pic=picture
                    )
                    user_id = doc.id
                    print("user_id", user_id)
                    # user_obj = User(user_id)
                    login_user(user_obj)
                    return redirect(url_for('dashboard'))
            # return 'Invalid username or password'
            error = 'Invalid username or password'
            return render_template('login.html', error=error, form_data=form_data)

    if current_user.is_authenticated:
        print("current_user", current_user)
        return redirect(url_for('dashboard'))
    else:
        return render_template('login.html')


@app.route('/resetPassword', methods=["GET", "POST"])
def resetPassword():
    return render_template('resetPassword.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


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
            "disease": "disease",
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
            "role": "assistant", "content": "i couldn't get you, check console.."
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
