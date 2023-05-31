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


class IsStaffOrOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method in ['PUT', 'PATCH']:
            if request.user.is_staff and not request.user.is_superuser:
                # Usuarios staff pueden editar todos los campos
                return True
            else:
                # Usuarios propietarios pueden editar todos los campos excepto "is_staff"
                return obj == request.user and 'is_staff' not in request.data
        return False

