import base64

import requests
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models.functions import ExtractMonth

from main.permissions import IsStaffOrReadOnly
from main.serializers import *
from main.utils import _calcular_importe, _calcular_gasto_y_consumo_total, FiltrarConexionesFechas, \
    FiltrarUsuariosFechas


# Create your views here.

class UsuarioView(viewsets.ModelViewSet):
    # permission_classes = [IsOwnerOrReadOnly]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, FiltrarUsuariosFechas]
    search_fields = ['username']
    ordering_fields = ['id', 'username', 'date_joined']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        total_usuarios = Usuario.objects.exclude(is_staff=True).count()
        usuarios_con_conexion_activa = Usuario.objects.exclude(is_staff=True).filter(
            conexion__finalizada=False).distinct().count()
        usuarios_sin_conexion = total_usuarios - usuarios_con_conexion_activa

        data = {
            'total_usuarios': total_usuarios,
            'usuarios_con_conexion_activa': usuarios_con_conexion_activa,
            'usuarios_sin_conexion': usuarios_sin_conexion
        }

        return Response(data)

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

    def get_queryset(self):
        queryset = Usuario.objects.all()
        username = self.request.query_params.get('usuario')
        email = self.request.query_params.get('email')

        if username:
            queryset = queryset.filter(username__icontains=username)

        if email:
            queryset = queryset.filter(email__icontains=email)

        return queryset


class EstacionView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['nombre', 'direccion', 'provincia__nombre']
    ordering = ['-id']

    def create(self, request, *args, **kwargs):
        num_puestos = request.data.get('num_puestos')
        if not num_puestos:
            return Response({'error': 'El número de puestos es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:

            num_puestos = int(num_puestos)
            if num_puestos < 1:
                return Response({'error': 'El número de puestos debe ser mayor a cero.'},
                                status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():

                response = super().create(request, *args, **kwargs)  # Crea la estación
                estacion = Estacion.objects.get(id=response.data['id'])
                if response.status_code == status.HTTP_201_CREATED:

                    for i in range(num_puestos):
                        Puesto.objects.create(estacion=estacion, disponible=True)  # Crea los puestos

            return response

        except ValueError:
            return Response({'error': 'El número de puestos debe ser un entero válido.'},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def estadisticas_estaciones(self, request):
        estaciones_con_puestos_ocupados = Estacion.objects.annotate(
            num_puestos_ocupados=Count('puesto', filter=Q(puesto__disponible=False))).filter(
            num_puestos_ocupados__gt=0).count()
        estaciones_sin_puestos_ocupados = Estacion.objects.annotate(
            num_puestos_ocupados=Count('puesto', filter=Q(puesto__disponible=False))).filter(
            num_puestos_ocupados=0).count()

        data = {
            'estaciones_activas': estaciones_con_puestos_ocupados,
            'estaciones_inactivas': estaciones_sin_puestos_ocupados
        }
        return Response(data)

    def get_queryset(self):
        queryset = Estacion.objects.all()
        estacion = self.request.query_params.get('estacion')
        direccion = self.request.query_params.get('direccion')
        provincia = self.request.query_params.get('provincia')
        comunidad = self.request.query_params.get('comunidad')

        if estacion:
            queryset = queryset.filter(nombre__icontains=estacion)

        if direccion:
            direccion = direccion.strip()
            queryset = queryset.filter(direccion__icontains=direccion)

        if provincia:
            queryset = queryset.filter(provincia__nombre__icontains=provincia)

        if comunidad:
            queryset = queryset.filter(provincia__comunidad_autonoma__nombre__icontains=comunidad)

        return queryset


class PuestoView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Puesto.objects.all()
    serializer_class = PuestoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['id', 'estacion__nombre']
    filterset_fields = ['id', 'estacion']

    def create(self, request, *args, **kwargs):
        estacion_id = request.data.get('estacion_id')
        num_puestos = request.data.get('num_puestos')

        if estacion_id:
            # Creación de puestos para una estación existente
            estacion = get_object_or_404(Estacion, id=estacion_id)

            try:
                num_puestos = int(num_puestos)
                if num_puestos < 1:
                    return Response({'error': 'El número de puestos debe ser mayor a cero.'},
                                    status=status.HTTP_400_BAD_REQUEST)

                puestos = []
                for i in range(num_puestos):
                    puesto = Puesto(estacion=estacion, disponible=True)
                    puestos.append(puesto)

                Puesto.objects.bulk_create(puestos)

                return Response({'message': f'Se crearon {num_puestos} puestos para la estación {estacion_id}.'},
                                status=status.HTTP_201_CREATED)

            except ValueError:
                return Response({'error': 'El número de puestos debe ser un entero válido.'},
                                status=status.HTTP_400_BAD_REQUEST)

        else:
            # Creación de un objeto normal
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MarcaView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class ModeloView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering = ['id']
    filterset_fields = ['marca']


class PatineteView(viewsets.ModelViewSet):
    queryset = Patinete.objects.all()
    serializer_class = PatineteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario', 'id']

    def get_queryset(self):
        queryset = Patinete.objects.all()
        usuario_id = self.request.query_params.get('usuario')
        patinete = self.request.query_params.get('patinete')

        if usuario_id:
            queryset = queryset.filter(usuario=usuario_id).annotate(num_patinetes=Count('usuario'))

        if patinete:
            queryset = queryset.filter(
                Q(modelo__marca__nombre__icontains=patinete) |
                Q(modelo__nombre__icontains=patinete)
            )

        return queryset


class ConexionView(viewsets.ModelViewSet):
    serializer_class = ConexionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, FiltrarConexionesFechas]
    search_fields = ['patinete__marca', 'patinete__modelo', 'puesto__estacion__nombre', 'consumo',
                     'importe']
    ordering_fields = ['id', 'patinete__modelo', 'puesto', 'consumo', 'horaConexion', 'horaDesconexion', 'importe']
    filterset_fields = ['id', 'usuario', 'puesto', 'finalizada']

    def create(self, request, *args, **kwargs):
        puesto_id = request.data.get('puesto_id')
        patinete_id = request.data.get('patinete_id')

        puesto = get_object_or_404(Puesto, id=puesto_id)
        patinete = get_object_or_404(Patinete, id=patinete_id)

        puesto.disponible = False
        puesto.save()
        patinete.disponible = False
        patinete.save()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def conexiones_activas(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Filtra solo las conexiones no finalizadas
        queryset = queryset.filter(finalizada=False)
        # Calcula el importe para cada conexión en el queryset
        for conexion in queryset:
            conexion_actualizada = _calcular_importe(conexion.id)
            conexion.importe = conexion_actualizada.importe
            conexion.consumo = conexion_actualizada.consumo

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def conexion_actual(self, request):
        usuario_id = self.request.query_params.get('usuario')
        puesto_id = self.request.query_params.get('puesto')

        puesto = get_object_or_404(Puesto, id=puesto_id)
        if not puesto.disponible:
            conexiones = Conexion.objects.filter(usuario=usuario_id, puesto=puesto_id, finalizada=False)
            if conexiones:
                conexion = conexiones[0]
                if str(conexion.usuario_id) == usuario_id and not conexion.finalizada:
                    serializer = self.get_serializer(conexion)
                    return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def calcular_importe(self, request):
        conexion_id = self.request.query_params.get('id')
        conexion = _calcular_importe(conexion_id)
        serializer = self.get_serializer(conexion)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def gasto_y_consumo_total(self, request):
        usuario_id = self.request.query_params.get('usuario')
        gasto_total, consumo_total = _calcular_gasto_y_consumo_total(usuario_id)
        data = {
            'gasto_total': gasto_total,
            'consumo_total': consumo_total
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def gasto_y_consumo_total_todos_usuarios(self, request):
        gasto_total, consumo_total = _calcular_gasto_y_consumo_total()
        data = {
            'gasto_total': gasto_total,
            'consumo_total': consumo_total
        }
        return Response(data)

    def get_queryset(self):
        queryset = Conexion.objects.all()
        usuario_id = self.request.query_params.get('usuario')
        mes = self.request.query_params.get('mes')
        patinete = self.request.query_params.get('patinete')
        estacion = self.request.query_params.get('estacion')
        username = self.request.query_params.get('username')

        if usuario_id:
            queryset = queryset.filter(usuario=usuario_id)

        if mes:
            queryset = queryset.annotate(mes=ExtractMonth('horaConexion')).filter(mes=mes)

        if patinete:
            queryset = queryset.filter(
                Q(patinete__modelo__marca__nombre__icontains=patinete) |
                Q(patinete__modelo__nombre__icontains=patinete)
            )

        if estacion:
            queryset = queryset.filter(puesto__estacion__nombre__icontains=estacion)

        if username:
            queryset = queryset.filter(usuario__username__icontains=username)

        return queryset


class PagoView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class ComunidadAutonomaView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = ComunidadAutonoma.objects.all()
    serializer_class = ComunidadAutonomaSerializer


class ProvinciaView(viewsets.ModelViewSet):
    permission_classes = [IsStaffOrReadOnly]
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['comunidad_autonoma']
    ordering = ['id']


class LoginView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get(user=user)
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
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # Obtener objeto de conexión
        conexion_id = request.data['conexion']['id']
        conexion = get_object_or_404(Conexion, id=conexion_id)

        # Actualizar objeto de conexión si no está finalizada
        if not conexion.finalizada:
            conexion = _calcular_importe(conexion_id)
            conexion.save()

        # Crear objeto Order con la información del pago
        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "EUR",
                        "value": str(conexion.importe),
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
                importe=conexion.importe,
                id_transaccion_paypal=order['id']
            )
            pago.save()

            approval_url = next(link['href'] for link in order['links'] if link['rel'] == 'approve')
            return Response({"approval_url": approval_url})
        else:
            return Response({"error": response.json()})


class CapturePaymentView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

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
                # Actualizar objeto de pago
                pago.capturado = True
                pago.save()

                # Actualizar objeto de conexión y puesto
                conexion = get_object_or_404(Conexion, id=pago.conexion.id)
                conexion.horaDesconexion = timezone.now()
                conexion.finalizada = True
                conexion.save()

                puesto = get_object_or_404(Puesto, id=conexion.puesto.id)
                puesto.disponible = True
                puesto.save()

                id_patinete = pago.conexion.patinete.id
                patinete = get_object_or_404(Patinete, id=id_patinete)
                patinete.disponible = True
                patinete.save()

                return Response({"success": True})

        return Response({"error": "Error al capturar el pago"})
