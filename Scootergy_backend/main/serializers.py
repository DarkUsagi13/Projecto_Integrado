import string

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
        ordering = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre de usuario debe contener al menos 5 caracteres.")
        return value

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if len(value) < 1:
            raise serializers.ValidationError("La contraseña no puede estar vacía")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra minúscula.")
        if not any(char in string.punctuation for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos un signo de puntuación.")
        return value


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
            'estacion',
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
            'usuario',
        ]


class ConexionSerializer(serializers.HyperlinkedModelSerializer):
    patineteNombre = serializers.SerializerMethodField()

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
            'monto',
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
