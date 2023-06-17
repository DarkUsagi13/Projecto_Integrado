import requests
from django.conf import settings
from main.models import Pago
from main.test.utils_test import BaseTestCase
from main.utils import _calcular_importe

from main.views import get_access_token


class CreatePaymentViewTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        super().inicializar_conexion()

    def test_create_payment(self):
        # Obtener objeto de conexión
        conexion_id = self.conexion.id

        # Actualizar objeto de conexión si no está finalizada
        if not self.conexion.finalizada:
            self.conexion = _calcular_importe(conexion_id)
            self.conexion.save()

        # Crear objeto Order con la información del pago
        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "EUR",
                        "value": str(self.conexion.importe),
                    }
                }
            ],
            "application_context": {
                "return_url": "http://localhost:4200/perfil/resumen_pago",
                "cancel_url": "http://localhost:4200"
            }
        }

        # Obtener el token de acceso
        access_token = get_access_token(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
        if not access_token:
            self.fail('No se pudo obtener el token de acceso')

        # Configurar encabezados
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}',
        }

        # Realizar la solicitud POST a la API de PayPal
        response = requests.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', json=data, headers=headers)

        # Verificar el código de estado de la respuesta
        self.assertEqual(response.status_code, 201)

        # Obtener la respuesta JSON de la API de PayPal
        order = response.json()

        # Crear objeto de pago
        pago = Pago(
            usuario=self.conexion.usuario,
            conexion=self.conexion,
            importe=self.conexion.importe,
            id_transaccion_paypal=order['id']
        )
        pago.save()
        approval_url = next(link['href'] for link in order['links'] if link['rel'] == 'approve')
        self.assertEqual(pago.id_transaccion_paypal, order['id'])
        expected_token = r'\w+'  # Expresión regular para cualquier secuencia de caracteres alfanuméricos
        pattern = r'https://www\.sandbox\.paypal\.com/checkoutnow\?token=' + expected_token
        self.assertRegex(approval_url, pattern)
