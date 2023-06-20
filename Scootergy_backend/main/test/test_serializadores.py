from rest_framework.test import APITestCase

from django.urls import reverse
from main.serializers import *


class BaseTest(APITestCase):
    def setUp(self):
        self.comunidad_autonoma = ComunidadAutonoma.objects.create(nombre='Comunidad Autónoma 1')


class ComunidadAutonomaSerializerTest(BaseTest):
    def setUp(self):
        super().setUp()
        url = reverse('puesto-list')
        request = self.client.post(url).wsgi_request
        self.serializer = ComunidadAutonomaSerializer(instance=self.comunidad_autonoma, context={'request': request})

    def test_serializer_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), {'url', 'id', 'nombre'})

    def test_nombre_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['nombre'], self.comunidad_autonoma.nombre)
