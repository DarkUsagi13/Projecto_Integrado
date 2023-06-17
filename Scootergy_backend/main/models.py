from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


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


class Marca(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


class Modelo(models.Model):
    nombre = models.CharField(max_length=50)
    marca = models.ForeignKey(Marca, on_delete=models.RESTRICT)
    consumo = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre


class Patinete(models.Model):
    modelo = models.ForeignKey(Modelo, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return self.modelo.marca.nombre + ' ,' + self.modelo.nombre


class Conexion(models.Model):
    puesto = models.ForeignKey(Puesto, on_delete=models.RESTRICT)
    patinete = models.ForeignKey(Patinete, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    consumo = models.DecimalField(max_digits=10, decimal_places=2)
    horaConexion = models.DateTimeField(auto_now_add=True)
    horaDesconexion = models.DateTimeField(null=True)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    finalizada = models.BooleanField(default=False)

    def __str__(self):
        return 'Conexión: ' + str(self.id) + ', Puesto: ' + str(self.puesto) + ', Hora: ' + str(self.horaConexion)


class Pago(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    conexion = models.ForeignKey(Conexion, on_delete=models.RESTRICT)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    moneda = models.CharField(max_length=3)
    fecha = models.DateTimeField(null=True)
    id_transaccion_paypal = models.CharField(max_length=100)

    def __str__(self):
        return str(self.usuario) + ', ' + str(self.conexion) + ', ' + self.id_transaccion_paypal
