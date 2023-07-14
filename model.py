# -*- coding: utf-8 -*-
"""
try in online:
https://vaip.onrender.com/


@author: younes.ammari
"""


import openai
import json
from dotenv import load_dotenv, find_dotenv
import os
from flask_login import UserMixin
from firebase_admin import credentials, auth, firestore, initialize_app


load_dotenv(find_dotenv())

openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize Firebase
cred = credentials.Certificate("secrets/serviceAccountKey.json")
initialize_app(cred)
db = firestore.client()


DISEASES = []
with open('diseases.json', 'r') as file:
    data = file.read()
    DISEASES = json.loads(data)

# print(DISEASES)

# openai.api_key = key


class Patient():
    def __init__(self, disease="Migraine"):
        self.disease = disease
        self.chief_complaint = ""
        self.hotspots = ""
        self.symptoms = ""
        self.patient_info = ""
        self.chat_prompt = f'''task: act like a patient who has {self.disease} symptoms - you'll be asked several question about your feeling as a {self.disease} patient. - Do not mention {self.disease} in any answer - do not say :How can I assist you? , replace it with :how you can help me? - patient information: {self.patient_info}'''
        self.info_prompt = f'task: act like a patient who has {self.disease} symptoms - provide me with Chief Complaint of 60 words, medical history should not exceed 40 words. - Do not mention {self.disease} in any answer.- generate random name, random age, random nationality, random professional - output example: {{"name": "fullname", "age": number, "nationality": "algerian", "sex": sex, "professional": "teacher", "chief-complaint": "...here", "medical-history", "medical history here..."}}'
        self.symptoms_prompt = f'''you'll receive a chief complaint of a patient between three backtick; task: 1-extract all symptoms, 2-assign each symptom with the occurred body part in the human body, 3-output only markdown JSON format example: [{{"symptom": string, "symptom-description": string, "body-part": "body part here"}}, ...] ```{self.chief_complaint}``` '''

    def chat_with_gpt(self, prompt) -> str:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        if completion.choices[0].message:
            return completion.choices[0].message.content
        else:
            return "Sorry, I couldn't generate a response at the moment."

    def get_info(self) -> dict:
        demo_output = {'name': 'Julia Schmidt', 'age': 42, 'nationality': 'German', 'sex': 'female', 'professional': 'banker', 'chief-complaint':
                       "I've been experiencing persistent fatigue, unexplained weight loss, recurring fevers, and night sweats for the past few months. Additionally, my appetite has significantly decreased, and I have noticed small, painless bumps on my skin. Recently, I have also been suffering from frequent bouts of diarrhea and have been feeling extremely weak. These symptoms have been affecting my daily life and causing me great concern.", 'medical-history': 'Patient has a history of asthma and occasional allergies.'}

        # Try another times if process failed
        for i in range(1, 6):
            print('info try n°:', i, self.disease)
            try:
                response_json = json.loads(
                    self.chat_with_gpt(self.info_prompt))
                self.chief_complaint = response_json["chief-complaint"]
                self.patient_info = response_json
                self.update_chat_prompt()
                return response_json
            except Exception as e:
                print('Error info try n°:', i, e)
                pass

        return demo_output

    def get_symptoms(self) -> list:
        demo_output = {}
        if self.chief_complaint == "":
            self.get_info()

        # Try another times if process failed
        for i in range(1, 6):
            print('symptoms try n:°', i, self.chief_complaint[:11], "...")
            try:
                response = self.chat_with_gpt(self.symptoms_prompt)
                response_json = json.loads(response)
                self.symptoms = response_json
                return response_json
            except Exception as e:
                print('symptoms info try n°:', i, e)
                pass

        return demo_output

    def get_hotspots(self) -> list:
        with open('hotspots.json', 'r') as file:
            data = file.read()
            self.hotspots = json.loads(data)

        new = []
        if self.symptoms == "":
            self.get_symptoms()
        for h in self.hotspots:
            ss = []
            matched = False
            for s in self.symptoms:
                # Assigning each symptom to a body part
                if any(symptom in h["text"] for symptom in s["body-part"].split(' ')):
                    matched = True
                    print("matched", "body-part",
                          s["body-part"], "--", "text", h["text"])
                    ss.append(s)
            if matched:
                h["symptoms"] = ss
                new.append(h)
        print('get_hotspots', new)
        return new

    def chat(self, messages: list) -> list:
        initial_prompt = {
            "role": "user",
            "content": self.chat_prompt
        }

        messages.insert(0, initial_prompt)

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        message_completion = {"role": "assistant"}

        if completion.choices[0].message:
            message_completion['content'] = completion.choices[0].message['content']
        else:
            message_completion["content"] = "Sorry, I couldn't generate a response at the moment."

        messages.append(message_completion)
        # This returns only response without initial prompt
        return messages[1:]

    def update_chat_prompt(self):
        self.chat_prompt = f'''task: act like a patient who has {self.disease} symptoms - you'll be asked several question about your feeling as a {self.disease} patient. - Do not mention {self.disease} in any answer - do not say :How can I assist you? , replace it with :how you can help me? - patient information: {self.patient_info}'''





class User(UserMixin):
    def __init__(self, user_id, name="name", email="email", profile_pic="https://cdn.vectorstock.com/i/preview-1x/20/76/man-avatar-profile-vector-21372076.jpg"):
        self.id = user_id
        self.name = name
        self.email = email
        self.profile_pic = profile_pic

    # def get_id(self):
    #     return self.id
    
    # @staticmethod
    def get_id(self):
        print(self.id)
        if self.id : return self.id
        else: return None
        
    def get_data(self):
        user_ref = db.collection('users').document(str(self.id))
        user_doc = user_ref.get().to_dict()
        if user_doc:
            username = user_doc.get('username')
            email = user_doc.get('email')
            self.name = username
            self.email = email
            # picture = user_doc.get('picture')

            return {
                "id":self.id,
                "name":username,
                "email":email,
                "profile_pic":self.profile_pic,
            }
        else:
            return "User not found"


    def is_authenticated(self):
        if self.id : return True
        else: return None
