from django.urls import reverse
from django.utils import timezone
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT

from main.models import Conexion
from main.serializers import ConexionSerializer
from main.test.utils_test import BaseTestCase


class ConexionViewTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        super().inicializar_conexion()
        self.url = reverse('conexion-detail', args=[self.conexion.id])

    def test_retrieve_conexion(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.data['id'], self.conexion.id)

    def test_update_conexion(self):
        self.conexion.finalizada = True
        self.conexion.horaDesconexion = timezone.now()
        self.conexion.save()
        url = reverse('conexion-detail', args=[self.conexion.id])

        request = self.client.put(url).wsgi_request
        serializer = ConexionSerializer(instance=self.conexion, context={'request': request})
        data = serializer.data
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertTrue(response.data['finalizada'])
        self.assertIsNotNone(self.conexion.horaDesconexion)

    def test_delete_conexion(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
        self.assertFalse(Conexion.objects.filter(
            id=self.conexion.id).exists())

    def test_conexiones_activas(self):
        url = reverse('conexion-list')
        response = self.client.get(url)
        conexiones_activas = response.data
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(len(conexiones_activas), 1)
        # Verificar que las conexiones tienen el importe y consumo actualizados
        conexion_activa = conexiones_activas[0]
        self.assertIsNotNone(conexion_activa['importe'])
        self.assertIsNotNone(conexion_activa['consumo'])

    def test_calcular_importe(self):
        url = reverse('conexion-calcular-importe') + '?id=' + str(self.conexion.id)

        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_gasto_y_consumo_total(self):
        url = reverse('conexion-gasto-y-consumo-total') + '?usuario' + str(self.usuario.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_gasto_y_consumo_total_todos_usuarios(self):
        url = reverse('conexion-gasto-y-consumo-total-todos-usuarios')
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_get_queryset_with_usuario_id(self):
        url = reverse('conexion-list') + '?usuario=' + str(self.usuario.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_get_queryset_with_mes(self):
        url = reverse('conexion-list') + '?mes=' + str(6)
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_get_queryset_with_patinete(self):
        url = reverse('conexion-list') + '?patinete=prue'
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_get_queryset_with_estacion(self):
        url = reverse('conexion-list') + '?estacion=' + str(self.estacion.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, HTTP_200_OK)
