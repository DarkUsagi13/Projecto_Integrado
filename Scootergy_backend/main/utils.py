import math
from datetime import datetime

from _decimal import ROUND_HALF_UP
from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework.generics import get_object_or_404

from main.models import Conexion
from decimal import Decimal
from rest_framework import filters


def _calcular_horas_utilizadas(conexion):
    if conexion.horaDesconexion:
        horas_utilizadas = (conexion.horaDesconexion - conexion.horaConexion).total_seconds() / 3600
    else:
        horas_utilizadas = (timezone.now() - conexion.horaConexion).total_seconds() / 3600
    return horas_utilizadas


def _calcular_importe(conexion_id):
    conexion = get_object_or_404(Conexion, id=conexion_id)
    consumo_por_hora = conexion.patinete.modelo.consumo
    horas_utilizadas = _calcular_horas_utilizadas(conexion)

    tarifa_consumo = Decimal('0.15')

    consumo_total = consumo_por_hora * Decimal(horas_utilizadas)
    importe = tarifa_consumo * consumo_total + Decimal(0.01)

    # Agregar IVA
    iva = Decimal('0.21')  # IVA del 21%
    importe_con_iva = importe * (1 + iva)

    conexion.consumo = consumo_total + Decimal(0.01)
    conexion.importe = importe_con_iva.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    return conexion


def _calcular_gasto_y_consumo_total(usuario_id=None):
    queryset = Conexion.objects.filter(finalizada=True)
    if usuario_id:
        queryset = queryset.filter(usuario=usuario_id)
    gasto_total = queryset.aggregate(total_gasto=Sum('importe'))['total_gasto'] or 0
    consumo_total = queryset.aggregate(total_consumo=Sum('consumo'))['total_consumo'] or 0
    return gasto_total, consumo_total


class FiltrarConexionesFechas(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(
                Q(horaConexion__date__range=[fecha_inicio, fecha_fin])
            )
        elif fecha_inicio:
            queryset = queryset.filter(horaConexion__date__gte=fecha_inicio)
        elif fecha_fin:
            queryset = queryset.filter(horaConexion__date__lte=fecha_fin)

        return queryset


class FiltrarUsuariosFechas(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(
                Q(date_joined__date__range=[fecha_inicio, fecha_fin])
            )
        elif fecha_inicio:
            queryset = queryset.filter(date_joined__date__gte=fecha_inicio)
        elif fecha_fin:
            queryset = queryset.filter(date_joined__date__lte=fecha_fin)

        return queryset
