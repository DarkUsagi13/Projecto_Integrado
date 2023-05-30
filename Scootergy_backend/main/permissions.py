from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Permitir operaciones de solo lectura (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        print(obj)
        # Permitir al propietario realizar operaciones de escritura
        return obj == request.user


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Permitir el acceso si el usuario es un administrador o la solicitud es de solo lectura
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.is_staff
