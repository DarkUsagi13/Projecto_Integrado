import base64

import requests
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models.functions import ExtractMonth

from main.serializers import *
from main.utils import _calcular_monto


# Create your views here.

class Paginacion(PageNumberPagination):
    page_size = 10  # Define el número de elementos que se mostrarán por página
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        if self.request.query_params.get('page') == '-1':
            return Response(data)
        return super().get_paginated_response(data)


class UsuarioView(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def update(self, request, *args, **kwargs):
        # Obtener el usuario que se va a actualizar
        usuario = self.get_object()
        # Obtener los datos actualizados del usuario
        serializer = self.get_serializer(usuario, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Verificar si se cambió la contraseña
        if 'password' in request.data:
            # Cambiar la contraseña del usuario
            usuario.set_password(request.data['password'])
            usuario.save()
            # Regenerar el token de autenticación del usuario
            usuario.regenerar_token()
        return Response(serializer.data)


class EstacionView(viewsets.ModelViewSet):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer


class PuestoView(viewsets.ModelViewSet):
    queryset = Puesto.objects.all()
    serializer_class = PuestoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['id', 'estacion__nombre']
    filterset_fields = ['estacion']

    def perform_create(self, serializer):
        print("holaaa")
        if 'disponible' in serializer.validated_data and not serializer.validated_data['disponible']:
            raise serializers.ValidationError("El puesto no está disponible")
        super().perform_create(serializer)


class PatineteView(viewsets.ModelViewSet):
    queryset = Patinete.objects.all()
    serializer_class = PatineteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario']


class ConexionView(viewsets.ModelViewSet):
    serializer_class = ConexionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['id']
    filterset_fields = ['id', 'usuario', 'puesto', 'finalizada']
    pagination_class = Paginacion

    @action(detail=False, methods=['get'])
    def conexion_actual(self, request):
        usuario_id = self.request.query_params.get('usuario')
        puesto_id = self.request.query_params.get('puesto')
        puesto = get_object_or_404(Puesto, id=puesto_id)
        if not puesto.disponible:
            # conexion = get_object_or_404(Conexion, puesto=puesto_id)
            conexiones = Conexion.objects.filter(usuario=usuario_id, puesto=puesto_id, finalizada=False)
            if conexiones:
                conexion = conexiones[0]
                if str(conexion.usuario_id) == usuario_id and not conexion.finalizada:
                    serializer = self.get_serializer(conexion)
                    return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def calcular_monto(self, request):
        conexion_id = self.request.query_params.get('id')
        conexion = _calcular_monto(conexion_id)
        serializer = self.get_serializer(conexion)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def gasto_total(self, request):
        usuario_id = self.request.query_params.get('usuario')
        conexiones = Conexion.objects.filter(usuario=usuario_id, finalizada=True)
        gasto_total = sum(conexion.monto for conexion in conexiones)
        data = {'gasto_total': gasto_total}
        return Response(data)

    @action(detail=False, methods=['get'])
    def consumo_total(self, request):
        usuario_id = self.request.query_params.get('usuario')
        conexiones = Conexion.objects.filter(usuario=usuario_id, finalizada=True)
        consumo_total = sum(conexion.consumo for conexion in conexiones)
        data = {'consumo_total': consumo_total}
        return Response(data)



    def get_queryset(self):
        queryset = Conexion.objects.all()
        usuario_id = self.request.query_params.get('usuario')
        mes = self.request.query_params.get('mes')

        if usuario_id:
            queryset = queryset.filter(usuario=usuario_id)
        if mes:
            queryset = queryset.annotate(mes=ExtractMonth('horaConexion')).filter(mes=mes)

        return queryset


class PagoView(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class ComunidadAutonomaView(viewsets.ModelViewSet):
    queryset = ComunidadAutonoma.objects.all()
    serializer_class = ComunidadAutonomaSerializer


class ProvinciaView(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer


class LoginView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get(user=user)
        print(token.key + ", " + user.username)
        return Response({
            'token': token.key,
            'id': user.pk,
            'username': user.username
        })


class Registro(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)


def get_access_token(client_id, client_secret):
    auth_string = f'{client_id}:{client_secret}'
    base64_auth_string = base64.b64encode(auth_string.encode()).decode()
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Basic {base64_auth_string}',
    }
    data = {
        'grant_type': 'client_credentials',
    }
    response = requests.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', headers=headers, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        return None


class CreatePaymentView(APIView):
    def post(self, request):
        # Obtener objeto de conexión
        conexion_id = request.data['conexion']['id']
        conexion = get_object_or_404(Conexion, id=conexion_id)

        # Actualizar objeto de conexión si no está finalizada
        if not conexion.finalizada:
            conexion = _calcular_monto(conexion_id)
            conexion.save()

        # Crear objeto Order con la información del pago
        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "EUR",
                        "value": str(conexion.monto),
                    }
                }
            ],
            "application_context": {
                "return_url": "http://localhost:4200/perfil/resumen_pago",
                "cancel_url": "http://localhost:4200"
            }
        }

        # Obtener token de acceso
        access_token = get_access_token(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
        if not access_token:
            return Response({"error": "No se pudo obtener el token de acceso"})

        # Configurar encabezados
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}',
        }

        # Crear la Order en PayPal
        response = requests.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', json=data, headers=headers)
        if response.status_code == 201:
            order = response.json()

            # Crear objeto de pago
            pago = Pago(
                usuario=conexion.usuario,
                conexion=conexion,
                monto=conexion.monto,
                id_transaccion_paypal=order['id']
            )
            pago.save()

            approval_url = next(link['href'] for link in order['links'] if link['rel'] == 'approve')
            return Response({"approval_url": approval_url})
        else:
            return Response({"error": response.json()})


class CapturePaymentView(APIView):
    def post(self, request):
        # Obtener ID de pago y pagador
        payment_id = request.data.get("payment_id")
        payer_id = request.data.get("payer_id")

        # Obtener objeto de pago
        pago = get_object_or_404(Pago, id_transaccion_paypal=payment_id)
        pago.fecha = timezone.now()
        pago.save()

        # Obtener token de acceso
        access_token = get_access_token(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
        if access_token:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}',
            }
            capture_url = f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{payment_id}/capture'

            # Capturar el pago en PayPal
            response = requests.post(capture_url, json={"payer_id": payer_id}, headers=headers)
            if response.status_code == 201:
                # Actualizar objeto de conexión y puesto
                conexion = get_object_or_404(Conexion, id=pago.conexion.id)
                conexion.horaDesconexion = timezone.now()
                conexion.finalizada = True
                conexion.save()

                puesto = get_object_or_404(Puesto, id=conexion.puesto.id)
                puesto.disponible = True
                puesto.save()

                return Response({"success": True})

        return Response({"error": "Error al capturar el pago"})
