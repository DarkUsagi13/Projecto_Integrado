from django.db import IntegrityError
from django.utils import timezone
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_204_NO_CONTENT
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate, APITestCase
from django.urls import reverse

from main.serializers import *
from main.test.utils_test import BaseTestCase
from main.views import UsuarioView, get_access_token


class UsuarioViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.view = UsuarioView.as_view({'get': 'list', 'put': 'update'})
        self.url = reverse('usuario-list')

    def test_list_authenticated_user(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.usuario)
        response = self.view(request)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_list_unauthenticated_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_estadisticas_authenticated_user(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.usuario)
        response = self.view(request)
        self.assertEqual(response.status_code, HTTP_200_OK)


class EstacionViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.serializer = EstacionSerializer(instance=self.estacion)

    def test_retrieve_estacion(self):
        self.url = reverse('estacion-detail', args=[self.estacion.id])  # Mover la definición de self.url aquí
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)  # Verificar que se haya obtenido correctamente
        self.assertEqual(response.data['nombre'], self.estacion.nombre)  # Verificar los datos obtenidos

    def test_update_estacion(self):
        self.url = reverse('estacion-detail', args=[self.estacion.id])  # Mover la definición de self.url aquí
        self.estacion.nombre = "Nuevo nombre"
        self.estacion.direccion = "Nueva dirección"
        self.estacion.save()

        request = self.client.put(self.url).wsgi_request
        # Instanciar el serializador con el objeto Estacion y el contexto del request
        serializer = EstacionSerializer(instance=self.estacion, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)  # Verificar que se haya actualizado correctamente
        self.assertEqual(response.data['nombre'], 'Nuevo nombre')  # Verificar los datos actualizados

    def test_delete_estacion(self):
        self.url = reverse('estacion-detail', kwargs={'pk': self.estacion.pk})
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)  # Verificar que se haya eliminado correctamente
        self.assertFalse(Estacion.objects.filter(
            id=self.estacion.id).exists())  # Verificar que el objeto haya sido eliminado de la base de datos


class PuestoViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.puesto = Puesto.objects.create(estacion=self.estacion, disponible=True)
        self.url = reverse('puesto-detail', args=[self.puesto.id])

    def test_create_puesto(self):
        url = reverse('puesto-list')
        request = self.client.post(url).wsgi_request
        serializer = PuestoSerializer(instance=self.puesto, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_puesto(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.puesto.id)

    def test_update_puesto(self):
        self.puesto.disponible = False
        self.puesto.save()

        request = self.client.put(self.url).wsgi_request
        serializer = PuestoSerializer(instance=self.puesto, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertFalse(response.data['disponible'])

    def test_delete_puesto(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Puesto.objects.filter(
            id=self.puesto.id).exists())


class MarcaViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('marca-detail', args=[self.marca.id])

    def test_create_marca(self):
        url = reverse('marca-list')
        request = self.client.post(url).wsgi_request
        serializer = MarcaSerializer(instance=self.marca, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_marca(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.marca.id)

    def test_update_marca(self):
        self.marca.nombre = 'Nuevo nombre de marca'
        self.marca.save()

        request = self.client.put(self.url).wsgi_request
        serializer = MarcaSerializer(instance=self.marca, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Nuevo nombre de marca')

    def test_delete_marca(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Marca.objects.filter(
            id=self.marca.id).exists())


class ModeloViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.modelo = Modelo.objects.create(nombre="Modelo de prueba", marca=self.marca, consumo=5.50)
        self.url = reverse('modelo-detail', args=[self.modelo.id])

    def test_create_modelo(self):
        url = reverse('modelo-list')
        request = self.client.post(url).wsgi_request
        serializer = ModeloSerializer(instance=self.modelo, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)
        self.assertEqual(response.data['nombre'], self.modelo.nombre)

    def test_retrieve_modelo(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.modelo.id)

    def test_update_modelo(self):
        self.modelo.nombre = 'Nuevo nombre de modelo'
        self.modelo.save()

        request = self.client.put(self.url).wsgi_request
        serializer = ModeloSerializer(instance=self.modelo, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Nuevo nombre de modelo')

    def test_delete_modelo(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Modelo.objects.filter(
            id=self.modelo.id).exists())


class PatineteViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.modelo = Modelo.objects.create(nombre="Modelo de prueba", marca=self.marca, consumo=5.50)
        self.patinete = Patinete.objects.create(usuario=self.usuario, modelo=self.modelo, disponible=True)
        self.url = reverse('patinete-detail', args=[self.patinete.id])

    def test_create_patinete(self):
        url = reverse('patinete-list')
        request = self.client.post(url).wsgi_request
        serializer = PatineteSerializer(instance=self.patinete, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_patinete(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.patinete.id)

    def test_update_patinete(self):
        self.patinete.disponible = False
        self.patinete.save()

        request = self.client.put(self.url).wsgi_request
        serializer = PatineteSerializer(instance=self.patinete, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertFalse(response.data['disponible'])

    def test_delete_patinete(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Patinete.objects.filter(
            id=self.patinete.id).exists())

    def test_get_queryset_with_usuario_id(self):
        url = reverse('patinete-list') + '?usuario=' + str(self.usuario.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_get_queryset_with_patinete(self):
        url = reverse('patinete-list') + '?patinete=prue'
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)


class PagoViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        super().inicializar_conexion()
        self.pago = Pago.objects.create(
            usuario=self.usuario,
            conexion=self.conexion,
            importe=10,
            moneda='EUR',
            id_transaccion_paypal='FJKG231SAMD521CDSXZ'
        )
        self.url = reverse('pago-detail', args=[self.pago.id])

    def test_create_pago(self):
        url = reverse('pago-list')
        request = self.client.post(url).wsgi_request
        serializer = PagoSerializer(instance=self.pago, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_pago(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.pago.id)

    def test_update_pago(self):
        self.pago.fecha = timezone.now()
        self.pago.save()

        request = self.client.put(self.url).wsgi_request
        serializer = PagoSerializer(instance=self.pago, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        # self.assertEqual(data['fecha'][:10], str(timezone.now().date()))

    def test_delete_modelo(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Pago.objects.filter(
            id=self.pago.id).exists())


class ComunidadAutonomaViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('comunidadautonoma-detail', kwargs={'pk': self.comunidad.id})

    def test_create_comunidad(self):
        url = reverse('comunidadautonoma-list')
        request = self.client.post(url).wsgi_request
        serializer = ComunidadAutonomaSerializer(instance=self.comunidad, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_comunidad(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.comunidad.id)

    def test_update_comunidad(self):
        self.comunidad.nombre = 'Nuevo nombre de comunidad'
        self.comunidad.save()

        request = self.client.put(self.url).wsgi_request
        serializer = ComunidadAutonomaSerializer(instance=self.comunidad, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Nuevo nombre de comunidad')

    def test_delete_comunidad(self):
        with self.assertRaises(IntegrityError):
            self.client.delete(self.url)


class ProvinciaViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('provincia-detail', args=[self.provincia.id])

    def test_create_provincia(self):
        url = reverse('provincia-list')
        request = self.client.post(url).wsgi_request
        serializer = ProvinciaSerializer(instance=self.provincia, context={'request': request})
        data = serializer.data
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_provincia(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.provincia.id)

    def test_update_provincia(self):
        self.provincia.nombre = 'Nuevo nombre de provincia'
        self.provincia.save()

        request = self.client.put(self.url).wsgi_request
        serializer = ProvinciaSerializer(instance=self.provincia, context={'request': request})
        data = serializer.data

        response = self.client.put(self.url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Nuevo nombre de provincia')

    def test_delete_provincia(self):
        with self.assertRaises(IntegrityError):
            self.client.delete(self.url)


class LoginViewTest(BaseTestCase):
    def setUp(self):
        # Crear un usuario de prueba adicional para este test
        self.test_user = Usuario.objects.create_user(
            username='testuser',
            password='testpassword',
            is_staff=True,
        )

        # Obtener el token de autenticación para el usuario de prueba
        response = self.client.post('/api-user-login/', {'username': 'testuser', 'password': 'testpassword'},
                                    format='json')
        self.test_token = response.data['token']

    def test_login(self):
        # Establecer las credenciales de autenticación para el usuario de prueba
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.test_token)

        # Realizar la solicitud de inicio de sesión
        url = '/api-user-login/'
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        # Verificar el código de estado de la respuesta
        self.assertEqual(response.status_code, HTTP_200_OK)

        # Verificar que se haya devuelto un token válido
        self.assertIn('token', response.data)
        token = response.data['token']
        self.assertIsInstance(token, str)
        self.assertNotEqual(token, '')


class RegistroTestCase(APITestCase):
    def test_registro(self):
        url = '/registro/'
        data = {
            'username': 'testuser',
            'email': 'testuser@mail.com',
            'password': 'Test-123',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

        # Verificar que se haya devuelto un token de actualización y acceso
        self.assertIn('tokens', response.data)
        tokens = response.data['tokens']
        self.assertIn('refresh', tokens)
        self.assertIn('access', tokens)
        self.assertIsInstance(tokens['refresh'], str)
        self.assertIsInstance(tokens['access'], str)
        self.assertNotEqual(tokens['refresh'], '')
        self.assertNotEqual(tokens['access'], '')


class GetAccessTokenTestCase(APITestCase):
    def test_get_access_token(self):
        access_token = get_access_token(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
        self.assertIsNotNone(access_token)
