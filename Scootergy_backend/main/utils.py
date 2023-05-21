import math

from _decimal import ROUND_HALF_UP
from django.utils import timezone
from rest_framework.generics import get_object_or_404

from main.models import Conexion
from decimal import Decimal


def _calcular_horas_utilizadas(conexion):
    if conexion.horaDesconexion:
        horas_utilizadas = (conexion.horaDesconexion - conexion.horaConexion).total_seconds() / 3600
    else:
        horas_utilizadas = (timezone.now() - conexion.horaConexion).total_seconds() / 3600
    return horas_utilizadas


def _calcular_monto(conexion_id):
    conexion = get_object_or_404(Conexion, id=conexion_id)
    consumo_por_hora = conexion.patinete.consumo
    horas_utilizadas = _calcular_horas_utilizadas(conexion)

    # Tarifa combinada
    tarifa_base = Decimal('0.50')  # Tarifa de $0.50 por cada 30 minutos
    tarifa_consumo = Decimal('0.08')  # Tarifa adicional de $0.08 por kWh

    consumo_total = consumo_por_hora * Decimal(horas_utilizadas)
    minutos_utilizados = horas_utilizadas * 60
    bloques_30min = math.ceil(minutos_utilizados / 30)  # Cálculo de bloques de 30 minutos redondeando hacia arriba
    monto_tiempo = tarifa_base * bloques_30min
    monto_combinado = monto_tiempo + (tarifa_consumo * consumo_total)

    conexion.consumo = consumo_total
    conexion.monto = monto_combinado.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    return conexion
