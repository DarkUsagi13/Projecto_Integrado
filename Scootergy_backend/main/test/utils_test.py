from rest_framework.generics import get_object_or_404
from rest_framework.test import APITestCase

from main.models import Usuario, ComunidadAutonoma, Provincia, Estacion, Marca, Conexion, Puesto, Modelo, Patinete
from rest_framework.authtoken.models import Token


class BaseTestCase(APITestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            username='testuser',
            password='testpassword',
            is_staff=True,
        )
        self.usuario.set_password('contraseña')
        self.usuario.save()
        # Obtener el token de autenticación del usuario
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crear una instancia de Estacion
        self.comunidad = ComunidadAutonoma.objects.create(nombre='Pruebas')
        self.provincia = Provincia.objects.create(nombre='Pruebas', comunidad_autonoma=self.comunidad)
        self.estacion = Estacion.objects.create(nombre='Estación Pruebas', direccion='Dirección Pruebas',
                                                provincia=self.provincia)

        self.marca = Marca.objects.create(nombre='Marca de pruebas')

    def inicializar_conexion(self):
        self.puesto = Puesto.objects.create(estacion=self.estacion, disponible=True)
        self.modelo = Modelo.objects.create(nombre="Modelo de prueba", marca=self.marca, consumo=5.50)
        self.patinete = Patinete.objects.create(usuario=self.usuario, modelo=self.modelo, disponible=True)
        self.conexion = Conexion.objects.create(
            puesto=self.puesto,
            patinete=self.patinete,
            usuario=self.usuario,
            consumo=15,
            horaDesconexion=None,
            importe=0,
            finalizada=False,
        )
        self.puesto.disponible = False
        self.patinete.disponible = False
