from django.test import TestCase

# Create your tests here.

from channels.testing import WebsocketCommunicator
from django.test import TestCase
from main.consumers import PuestoConsumer


class PuestoConsumerTest(TestCase):
    async def test_puesto_consumer(self):  # Agrega 'async' al método de prueba
        communicator = WebsocketCommunicator(PuestoConsumer.as_asgi(), "/ws/puestos/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        message = {
            "type": "actualizar_disponibilidad",
            "puesto_id": 1,
            "disponible": True
        }
        await communicator.send_json_to(message)

        response = await communicator.receive_json_from()
        self.assertEqual(response["puesto_id"], 1)
        self.assertEqual(response["disponible"], True)

        await communicator.disconnect()

