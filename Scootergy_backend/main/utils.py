import math

from _decimal import ROUND_HALF_UP
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Sum
from django.utils import timezone
from rest_framework.generics import get_object_or_404

from main.models import Conexion, Puesto
from decimal import Decimal


def _calcular_horas_utilizadas(conexion):
    if conexion.horaDesconexion:
        horas_utilizadas = (conexion.horaDesconexion - conexion.horaConexion).total_seconds() / 3600
    else:
        horas_utilizadas = (timezone.now() - conexion.horaConexion).total_seconds() / 3600
    return horas_utilizadas


def _calcular_importe(conexion_id):
    conexion = get_object_or_404(Conexion, id=conexion_id)
    consumo_por_hora = conexion.patinete.consumo
    horas_utilizadas = _calcular_horas_utilizadas(conexion)

    # Tarifa combinada
    tarifa_base = Decimal('0.50')  # Tarifa de $0.50 por cada 30 minutos
    tarifa_consumo = Decimal('0.15')  # Tarifa adicional de $0.15 por kWh

    consumo_total = consumo_por_hora * Decimal(horas_utilizadas)
    minutos_utilizados = horas_utilizadas * 60
    bloques_30min = math.ceil(minutos_utilizados / 30)  # Cálculo de bloques de 30 minutos redondeando hacia arriba
    importe_tiempo = tarifa_base * bloques_30min
    importe_combinado = importe_tiempo + (tarifa_consumo * consumo_total)

    # Agregar IVA
    iva = Decimal('0.21')  # IVA del 21%
    importe_con_iva = importe_combinado * (1 + iva)

    conexion.consumo = consumo_total
    conexion.importe = importe_con_iva.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    return conexion


def _calcular_gasto_y_consumo_total(usuario_id=None):
    queryset = Conexion.objects.filter(finalizada=True)
    if usuario_id:
        queryset = queryset.filter(usuario=usuario_id)
    gasto_total = queryset.aggregate(total_gasto=Sum('importe'))['total_gasto'] or 0
    consumo_total = queryset.aggregate(total_consumo=Sum('consumo'))['total_consumo'] or 0
    return gasto_total, consumo_total
