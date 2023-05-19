import base64

import requests
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models.functions import ExtractMonth

from main.serializers import *


# Create your views here.
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


class PatineteView(viewsets.ModelViewSet):
    queryset = Patinete.objects.all()
    serializer_class = PatineteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario']


class ConexionView(viewsets.ModelViewSet):
    serializer_class = ConexionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['id']
    filterset_fields = ['finalizada', 'usuario', 'id']

    @action(detail=False, methods=['get'])
    def calcular_monto(self, request):
        conexion_id = self.request.query_params.get('id')
        conexion = get_object_or_404(Conexion, id=conexion_id)  # Corrección aquí
        consumo_por_hora = conexion.patinete.consumo
        if conexion.horaDesconexion:
            horas_utilizadas = (conexion.horaDesconexion - conexion.horaConexion).total_seconds() / 3600
        else:
            # Si horaDesconexion es None, establece horas_utilizadas como 0
            horas_utilizadas = (timezone.now() - conexion.horaConexion).total_seconds() / 3600
        consumo_total = consumo_por_hora * Decimal(horas_utilizadas)
        conexion.consumido = consumo_total + Decimal(5)
        costo_por_kwh = 0.15
        monto_total = consumo_total * Decimal(costo_por_kwh) + Decimal(10)
        conexion.monto = monto_total.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        print(conexion)
        serializer = self.get_serializer(conexion)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = Conexion.objects.all()
        usuario_id = self.request.query_params.get('usuario')
        mes = self.request.query_params.get('mes')
        if usuario_id:
            queryset = queryset.filter(usuario=usuario_id)
        if mes:
            queryset = queryset.annotate(mes=ExtractMonth('horaConexion')).filter(mes=mes)
        return queryset

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     # Llama a la función calcular_monto() para cada objeto de conexión en el queryset
    #     for conexion in queryset:
    #         conexion.calcular_monto()
    #         print(conexion.monto)
    #         print(conexion.consumido)
    #         # conexion.save(update_fields=['consumido', 'monto'])
    #     # Ahora, puedes serializar y devolver los resultados con el monto calculado
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)


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
        conexion = request.data['conexion']
        conexion_obj = get_object_or_404(Conexion, id=conexion['id'])

        # Actualizar objeto de conexión si no está finalizada
        if not conexion_obj.finalizada:
            conexion_obj.horaDesconexion = timezone.now()
            conexion_obj.calcular_monto()
            conexion_obj.save()

        # Crear objeto Order con la información del pago
        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "EUR",
                        "value": str(conexion_obj.monto),
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
                usuario=conexion_obj.usuario,
                conexion=conexion_obj,
                monto=conexion_obj.monto,
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
                conexion.horaConexion = timezone.now()
                conexion.finalizada = True
                conexion.save()

                puesto = get_object_or_404(Puesto, id=conexion.puesto.id)
                puesto.disponible = True
                puesto.save()

                return Response({"success": True})

        return Response({"error": "Error al capturar el pago"})
