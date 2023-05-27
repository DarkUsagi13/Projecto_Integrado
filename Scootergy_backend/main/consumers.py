from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Puesto


class PuestoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("disponibilidad_puestos", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("disponibilidad_puestos", self.channel_name)

    async def send_actualizacion_disponibilidad(self, event):
        puesto_id = event['puesto_id']
        disponibilidad = event['disponibilidad']
        await self.send(text_data=f"Actualización de disponibilidad para el puesto {puesto_id}: {disponibilidad}")

