from django.urls import re_path
from .consumers import PuestoConsumer

websocket_urlpatterns = [
    re_path(r'ws/puestos/$', PuestoConsumer.as_asgi()),
]