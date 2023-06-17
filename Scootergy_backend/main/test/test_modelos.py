from django.test import TestCase
from main.models import *


class BaseTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create(username='Pruebas', password='Pruebas-123')

        self.comunidad_autonoma = ComunidadAutonoma.objects.create(nombre='Comunidad Autónoma 1')
        self.provincia = Provincia.objects.create(comunidad_autonoma=self.comunidad_autonoma, nombre='Provincia 1')
        self.estacion = Estacion.objects.create(nombre='Estación 1', direccion='Dirección 1', provincia=self.provincia)
        self.puesto = Puesto.objects.create(estacion=self.estacion)
        self.marca = Marca.objects.create(nombre='Marca 1')
        self.modelo = Modelo.objects.create(nombre='Modelo 1', marca=self.marca, consumo=10.5)
        self.patinete = Patinete.objects.create(modelo=self.modelo, usuario=self.usuario)
        self.conexion = Conexion.objects.create(puesto=self.puesto, patinete=self.patinete, usuario=self.usuario, consumo=10,
                                           horaDesconexion=None, importe=0)
        self.pago = Pago.objects.create(usuario=self.usuario, conexion=self.conexion, importe=100.0, moneda='USD',
                                        id_transaccion_paypal='123456789')


class ComunidadAutonomaModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_nombre_comunidad_autonoma(self):
        self.assertEqual(str(self.comunidad_autonoma), 'Comunidad Autónoma 1')


class ProvinciaModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_nombre_provincia(self):
        self.assertEqual(str(self.provincia), 'Provincia 1')

    def test_comunidad_autonoma_foreign_key(self):
        self.assertEqual(self.comunidad_autonoma.nombre, 'Comunidad Autónoma 1')


class EstacionModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_nombre_estacion(self):
        self.assertEqual(str(self.estacion), 'Estación 1')

    def test_direccion_estacion(self):
        self.assertEqual(self.estacion.direccion, 'Dirección 1')

    def test_provincia_foreign_key(self):
        self.assertEqual(self.provincia.nombre, 'Provincia 1')


class PuestoModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_disponible_puesto(self):
        self.assertTrue(self.puesto.disponible)


class MarcaModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_nombre_marca(self):
        self.assertEqual(str(self.marca), 'Marca 1')


class ModeloModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_nombre_modelo(self):
        self.assertEqual(str(self.modelo), 'Modelo 1')

    def test_marca_foreign_key(self):
        self.assertEqual(self.marca.nombre, 'Marca 1')


class PatineteModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_disponible_patinete(self):
        self.assertTrue(self.patinete.disponible)


class ConexionModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_finalizada_conexion(self):
        self.assertFalse(self.conexion.finalizada)


class PagoModelTest(BaseTest):
    def setUp(self):
        super().setUp()

    def test_importe_pago(self):
        self.assertEqual(self.pago.importe, 100.0)

    def test_moneda_pago(self):
        self.assertEqual(self.pago.moneda, 'USD')
