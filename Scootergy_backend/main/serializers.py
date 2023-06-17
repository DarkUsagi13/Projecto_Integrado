import string
import re

from rest_framework import serializers

from main.models import *


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
            'comunidad_autonoma',
            'nombre'
        ]


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
        ordering = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z0-9_.-]{5,16}$', value):
            raise serializers.ValidationError(
                "El nombre de usuario debe contener entre 5 y 16 caracteres y solo puede incluir letras, números, "
                "guiones bajos, puntos y guiones.")
        return value

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra minúscula.")
        if not any(char in string.punctuation for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos un signo de puntuación.")
        return value


class EstacionSerializer(serializers.HyperlinkedModelSerializer):
    provinciaNombre = serializers.SerializerMethodField()
    comunidadNombre = serializers.SerializerMethodField()
    total_puestos = serializers.SerializerMethodField()

    class Meta:
        model = Estacion
        fields = [
            'url',
            'id',
            'nombre',
            'direccion',
            'provincia',
            'provinciaNombre',
            'comunidadNombre',
            'total_puestos',
        ]

    def get_total_puestos(self, estacion):
        return Puesto.objects.filter(estacion=estacion).count()

    def get_provinciaNombre(self, obj):
        return "{}".format(obj.provincia.nombre)

    def get_comunidadNombre(self, obj):
        return "{}".format(obj.provincia.comunidad_autonoma.nombre)


class PuestoSerializer(serializers.HyperlinkedModelSerializer):
    identificador = serializers.SerializerMethodField()

    class Meta:
        model = Puesto
        fields = [
            'url',
            'id',
            'estacion',
            'disponible',
            'identificador',
        ]

    def get_identificador(self, obj):
        return "{}".format(obj.id)


class MarcaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Marca
        fields = [
            'url',
            'id',
            'nombre',
        ]


class ModeloSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Modelo
        fields = [
            'url',
            'id',
            'nombre',
            'consumo',
            'marca',
        ]


class PatineteSerializer(serializers.HyperlinkedModelSerializer):
    patineteNombre = serializers.SerializerMethodField()
    consumo = serializers.SerializerMethodField()

    class Meta:
        model = Patinete
        fields = [
            'url',
            'id',
            'modelo',
            'usuario',
            'disponible',
            'patineteNombre',
            'consumo',
        ]

    def get_patineteNombre(self, obj):
        return "{} {}".format(obj.modelo.marca.nombre, obj.modelo.nombre)

    def get_consumo(self, obj):
        return "{}".format(obj.modelo.consumo)


class ConexionSerializer(serializers.HyperlinkedModelSerializer):
    patineteNombre = serializers.SerializerMethodField()
    estacionNombre = serializers.SerializerMethodField()
    puestoId = serializers.SerializerMethodField()
    estacionId = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Conexion
        fields = [
            'url',
            'id',
            'puesto',
            'patinete',
            'usuario',
            'horaConexion',
            'horaDesconexion',
            'importe',
            'consumo',
            'finalizada',
            'patineteNombre',
            'estacionNombre',
            'puestoId',
            'estacionId',
            'username',
        ]

    def get_patineteNombre(self, obj):
        return "{} {}".format(obj.patinete.modelo.marca.nombre, obj.patinete.modelo.nombre)

    def get_username(self, obj):
        return obj.usuario.username

    def get_estacionNombre(self, obj):
        return obj.puesto.estacion.nombre

    def get_puestoId(self, obj):
        return obj.puesto.id

    def get_estacionId(self, obj):
        return obj.puesto.estacion.id


class PagoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pago
        fields = [
            'url',
            'id',
            'usuario',
            'conexion',
            'importe',
            'moneda',
            'fecha',
            'id_transaccion_paypal'
        ]
