import random
import string
import json
from datetime import datetime, timedelta

# Lista de palabras comunes para generar nombres de usuario
common_words = ['awesome', 'creative', 'fantastic', 'happy', 'lovely', 'sunny', 'brilliant', 'excellent', 'friendly',
                'joyful', 'positive', 'super', 'charming', 'funny', 'kind', 'smart', 'witty', 'amazing', 'cool',
                'energetic', 'genius', 'lucky', 'passionate', 'radiant', 'vibrant', 'adventurous', 'bubbly', 'dynamic',
                'hilarious', 'magnificent', 'optimistic', 'resilient', 'vivacious', 'beautiful', 'courageous',
                'enthusiastic', 'inspiring', 'marvelous', 'outgoing', 'strong', 'wonderful', 'bold', 'dazzling',
                'fierce', 'intelligent', 'motivated', 'playful', 'successful', 'youthful']


def generate_username():
    word = random.choice(common_words)
    number = random.randint(100, 999)
    username = f"{word}{number}"
    return username


def generate_email():
    word = random.choice(common_words)
    number = random.randint(1, 999)
    email = f"{word}{number}@mail.com"
    return email


def generate_date_joined():
    start_date = datetime(2023, 3, 1)
    end_date = datetime(2023, 6, 30)
    random_days = random.randint(0, (end_date - start_date).days)
    joined_date = start_date + timedelta(days=random_days)
    return joined_date.isoformat() + "Z"


def generate_dummy_user(pk):
    username = generate_username()
    email = generate_email()
    date_joined = generate_date_joined()

    user = {
        "model": "main.usuario",
        "pk": pk,
        "fields": {
            "password": "pbkdf2_sha256$390000$603t2EbGEwg8TlMYH5shkx$Zbn9WUtmkbqI+ccIFuIpx69iOaDkCqxSJAqriOdx8S0=",
            "last_login": "2023-06-13T12:05:45.164Z",
            "is_superuser": True,
            "username": username,
            "first_name": "",
            "last_name": "",
            "email": email,
            "is_staff": True,
            "is_active": True,
            "date_joined": date_joined,
            "groups": [],
            "user_permissions": []
        }
    }
    return user


# Generar 50 usuarios dummy
users = []
for i in range(1, 51):
    user = generate_dummy_user(i)
    users.append(user)

# Guardar los usuarios en un archivo JSON
with open('users.json', 'w') as file:
    json.dump(users, file, indent=4)

print("Usuarios guardados en users.json.")
