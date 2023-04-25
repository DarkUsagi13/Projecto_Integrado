from rest_framework import serializers

from main.models import *


class UsuarioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'url',
            'id',
            'username',
            'email',
            'password',
            'date_joined',
            'is_staff',
        ]


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este nombre de usuario ya existe.')
        return value

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)


class EstacionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Estacion
        fields = [
            'url',
            'id',
            'nombre',
            'direccion',
            'provincia'
        ]


class PuestoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Puesto
        fields = [
            'url',
            'id',
            'idEstacion',
            'disponible',
        ]


class PatineteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Patinete
        fields = [
            'url',
            'id',
            'marca',
            'modelo',
            'consumo',
            'idUsuario',
        ]


class ConexionSerializer(serializers.HyperlinkedModelSerializer):
    patineteNombre = serializers.SerializerMethodField()

    class Meta:
        model = Conexion
        fields = [
            'url',
            'id',
            'idPuesto',
            'idPatinete',
            'idUsuario',
            'horaConexion',
            'horaDesconexion',
            'precio',
            'consumido',
            'finalizada',
            'patineteNombre',
        ]

    def get_patineteNombre(self, obj):
        return "{} {}".format(obj.idPatinete.marca, obj.idPatinete.modelo)


class PagoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pago
        fields = [
            'url',
            'id',
            'usuario',
            'conexion',
            'monto',
            'moneda',
            'fecha',
            'id_transaccion_paypal'
        ]


class ComunidadAutonomaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ComunidadAutonoma
        fields = [
            'url',
            'id',
            'nombre'
        ]


class ProvinciaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Provincia
        fields = [
            'url',
            'id',
            'id_comunidad_autonoma',
            'nombre'
        ]
