# -*- coding: utf-8 -*-
"""
Created on Fri Jul  7 19:54:08 2023

@author: younes.ammari
"""


import openai
import json
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPENAI_API_KEY")


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
        self.info_prompt = f'task: act like a patient who has {self.disease} symptoms - provide me with Chief Complaint of 60 words, medical history should not exceed 40 words. - Do not mention {self.disease} in any answer.- generate random name, random age, random nationality, random professional - output example: {{"name": "fullname", "age": number, "nationality": "algerian", "sex": sex, "professional": "teacher", "chief-complaint": "...here", "medical-history", "medical history here..."}}'
        self.symptoms_prompt = f'''you'll receive a chief complaint of a patient between three backtick; task: 1-extract all symptoms, 2-assign each symptom with the occurred body part in the human body, 3-output only markdown JSON format example: [{{"symptom": string, "symptom-description": string, "body-part": "body part here"}}, ...] ```{self.chief_complaint}``` '''

    def chat_with_gpt(self, prompt):
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

    def get_info(self):
        demo_output = {'name': 'Julia Schmidt', 'age': 42, 'nationality': 'German', 'sex': 'female', 'professional': 'banker', 'chief-complaint':
                       "I've been experiencing persistent fatigue, unexplained weight loss, recurring fevers, and night sweats for the past few months. Additionally, my appetite has significantly decreased, and I have noticed small, painless bumps on my skin. Recently, I have also been suffering from frequent bouts of diarrhea and have been feeling extremely weak. These symptoms have been affecting my daily life and causing me great concern.", 'medical-history': 'Patient has a history of asthma and occasional allergies.'}

        # Try another times if process filed
        for i in range(1, 6):
            print('info try n°:', i, self.disease)
            try:
                response_json = json.loads(
                    self.chat_with_gpt(self.info_prompt))
                self.chief_complaint = response_json["chief-complaint"]
                return response_json
            except:
                pass

        return demo_output

    def get_symptoms(self):
        demo_output = {}
        if self.chief_complaint == "":
            self.get_info()

        # Try another times if process filed
        for i in range(1, 6):
            print('symptoms try n:°', i, self.chief_complaint[:11], "...")
            try:
                response = self.chat_with_gpt(self.symptoms_prompt)
                response_json = json.loads(response)
                self.symptoms = response_json
                return response_json
            except:
                pass

        return demo_output

    def get_hotspots(self):
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
                # any(symptom in text for symptom in symptoms_list)
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


# p = Patient(disease="Pneumonia")

# print(p.get_info())

# print(p.get_symptoms())

# print(p.get_hotspots())
