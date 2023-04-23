from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token


# Create your models here.

class ComunidadAutonoma(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    id_comunidad_autonoma = models.ForeignKey(ComunidadAutonoma, on_delete=models.RESTRICT)
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

    def cambiar_contrasenia(request):
        # Obtener el usuario actual
        usuario = request.user

        # Obtener la nueva contraseña
        nueva_contrasenia = request.POST.get('nueva_contrasenia')

        # Encriptar la nueva contraseña
        nueva_contrasenia_encriptada = make_password(nueva_contrasenia)

        # Cambiar la contraseña del usuario
        usuario.password = nueva_contrasenia_encriptada
        usuario.save()

        # Regenerar el token de autenticación del usuario
        usuario.regenerar_token()

        # Redirigir a la página de inicio de sesión
        return redirect('login')

    def __str__(self):
        return self.username


class Estacion(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=100)
    provincia = models.ForeignKey(Provincia, on_delete=models.RESTRICT)

    def __str__(self):
        return self.nombre


class Puesto(models.Model):
    idEstacion = models.ForeignKey(Estacion, on_delete=models.RESTRICT)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return 'Puesto :' + str(self.id) + ', Estación: ' + str(self.idEstacion)


class Patinete(models.Model):
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    consumo = models.DecimalField(max_digits=10, decimal_places=2)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)

    def __str__(self):
        return self.modelo + ', ' + self.marca


class Conexion(models.Model):
    idPuesto = models.ForeignKey(Puesto, on_delete=models.RESTRICT)
    idPatinete = models.ForeignKey(Patinete, on_delete=models.RESTRICT)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    consumido = models.DecimalField(max_digits=10, decimal_places=2)
    horaConexion = models.DateTimeField(auto_now_add=True)
    horaDesconexion = models.DateTimeField(null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    finalizada = models.BooleanField(default=False)

    def __str__(self):
        return 'Conexión: ' + str(self.id) + ', Puesto: ' + str(self.idPuesto) + ', Hora: ' + str(self.horaConexion)


class Tarjeta(models.Model):
    num_tarjeta = models.CharField(max_length=16)
    titular = models.CharField(max_length=50)
    cvv = models.CharField(max_length=4)
    fecha_caducidad = models.DateField()
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)

    def __str__(self):
        return self.titular + ', ' + self.num_tarjeta
