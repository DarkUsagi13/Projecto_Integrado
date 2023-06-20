import random
import json


def generate_dummy_patinetes(num_patinetes, num_usuarios, max_modelo):
    patinetes = []
    patinetes_por_usuario = [1] * num_usuarios  # Al menos un patinete por usuario inicialmente

    # Generar patinetes adicionales
    remaining_patinetes = num_patinetes - num_usuarios
    for i in range(remaining_patinetes):
        user_id = random.randint(1, num_usuarios)  # Asignar aleatoriamente a un usuario existente
        patinetes_por_usuario[user_id - 1] += 1  # Incrementar el número de patinetes del usuario seleccionado

    # Generar los objetos de patinete
    patinete_id = 1
    for user_id, num_patinetes in enumerate(patinetes_por_usuario):
        for _ in range(num_patinetes):
            patinete = {
                "model": "main.patinete",
                "pk": patinete_id,
                "fields": {
                    "modelo": random.randint(1, max_modelo),
                    "usuario": user_id + 1,  # El ID de usuario es 1-indexed
                    "disponible": True
                }
            }
            patinetes.append(patinete)
            patinete_id += 1

    return patinetes


# Generar 150 objetos de patinete con distribución aleatoria entre los usuarios
num_patinetes = 150
num_usuarios = 50
max_modelo = 49

patinetes = generate_dummy_patinetes(num_patinetes, num_usuarios, max_modelo)

# Guardar los objetos de patinete en un archivo JSON
with open('patinetes.json', 'w') as file:
    json.dump(patinetes, file, indent=4)

print("Objetos de patinete guardados en patinetes.json.")
