# Scootergy

_Proyecto integrado para el **Ciclo Formativo de Desarrollo de Aplicaciones Web** en el insituto **I.E.S Polígono Sur**._

Consiste en una aplicación que permite la carga de patinetes eléctricos en estaciones de carga dedicadas para ello.

_Autor_ 
* **MartinezHU**  - [DarkUsagi13](https://github.com/DarkUsagi13)

_Herramientas y lenguajes utilizados_
* TypeScript
* Python
* HTML
* CSS
* Boostrap
* AWS
* Docker
* Apache

## 2. Arquitectura
* **Base de datos:** Postgres
* **Front-end:** Angular 15
* **Back-end:** Django 4.1.7
  * API: Django Rest Framework 3.14
    
_Modelo entidad relacion_

<img src="https://github.com/DarkUsagi13/Projecto_Integrado/assets/92437709/cc99dbf8-c3d2-4941-9b59-db3f11e12827" alt="Modelo entidad-relación" width="500px">

#### Despliegue

_El despliegue se realiz贸 en dos instancias de **Amazon Web Services**, una instancia para el **front-end** y otra para el **back-end**. Cada instancias est谩n desplegadas en un servidor **Apache**_
<br>
<br>
<img src="https://github.com/DarkUsagi13/Projecto_Integrado/assets/92437709/a2252a85-6b64-4738-8f66-f3486ec0ef58" alt="Despliegue" width="500" />

## 3. Funcionalidades
_Las funcionalidades de la aplicación son las siguientes:_

* Login y Registro de usuario
* Administración de usuarios
* Administración de estaciones
* Registro de patinetes
* Selección de estación de carga y puesto
* Conectar/desconectar patinete a un puesto
* Gestión de perfil
* Pago mediante PayPal
