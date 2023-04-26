from django.contrib import admin
from django.urls import path, include, re_path, reverse_lazy
from django.views.generic import RedirectView

from main import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'usuario', views.UsuarioView, basename="usuario")
router.register(r'estacion', views.EstacionView, basename="estacion")
router.register(r'puesto', views.PuestoView, basename="puesto")
router.register(r'patinete', views.PatineteView, basename="patinete")
router.register(r'conexion', views.ConexionView, basename="conexion")
router.register(r'pago', views.PagoView, basename="pago")
router.register(r'comunidad_autonoma', views.ComunidadAutonomaView, basename="comunidadautonoma")
router.register(r'provincia', views.ProvinciaView, basename="provincia")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path("registro/", views.Registro.as_view(), name="create-user"),
    path('api-user-login/', views.LoginView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
    path('api/paypal/', views.PayPalAPIView.as_view(), name='paypal_api'),
]
