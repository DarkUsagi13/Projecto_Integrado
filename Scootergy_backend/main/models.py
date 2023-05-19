from _decimal import ROUND_HALF_UP
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from rest_framework.authtoken.models import Token
from decimal import Decimal


# Create your models here.

class ComunidadAutonoma(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    comunidad_autonoma = models.ForeignKey(ComunidadAutonoma, on_delete=models.RESTRICT)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    esAdmin = models.BooleanField(default=False)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)

    def regenerar_token(self):
        Token.objects.filter(user=self).delete()
        Token.objects.create(user=self)

    def __str__(self):
        return self.username


class Estacion(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=100)
    provincia = models.ForeignKey(Provincia, on_delete=models.RESTRICT)

    def __str__(self):
        return self.nombre


class Puesto(models.Model):
    estacion = models.ForeignKey(Estacion, on_delete=models.RESTRICT)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return 'Puesto :' + str(self.id) + ', Estación: ' + str(self.estacion)


class Patinete(models.Model):
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    consumo = models.DecimalField(max_digits=10, decimal_places=2)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)

    def __str__(self):
        return self.modelo + ', ' + self.marca


class Conexion(models.Model):
    puesto = models.ForeignKey(Puesto, on_delete=models.RESTRICT)
    patinete = models.ForeignKey(Patinete, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    consumido = models.DecimalField(max_digits=10, decimal_places=2)
    horaConexion = models.DateTimeField(auto_now_add=True)
    horaDesconexion = models.DateTimeField(null=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    finalizada = models.BooleanField(default=False)

    def __str__(self):
        return 'Conexión: ' + str(self.id) + ', Puesto: ' + str(self.puesto) + ', Hora: ' + str(self.horaConexion)

    def calcular_monto(self):
        consumo_por_hora = self.patinete.consumo
        if self.horaDesconexion:
            horas_utilizadas = (self.horaDesconexion - self.horaConexion).total_seconds() / 3600
        else:
            # Si horaDesconexion es None, establece horas_utilizadas como 0
            horas_utilizadas = (timezone.now() - self.horaConexion).total_seconds() / 3600
        consumo_total = consumo_por_hora * Decimal(horas_utilizadas)
        self.consumido = consumo_total + Decimal(5)
        costo_por_kwh = 0.15
        monto_total = consumo_total * Decimal(costo_por_kwh)
        self.monto = monto_total.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)


class Pago(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    conexion = models.ForeignKey(Conexion, on_delete=models.RESTRICT)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    moneda = models.CharField(max_length=3)
    fecha = models.DateTimeField(null=True)
    id_transaccion_paypal = models.CharField(max_length=100)

    def __str__(self):
        return str(self.usuario) + ', ' + str(self.conexion) + ', ' + self.id_transaccion_paypal
