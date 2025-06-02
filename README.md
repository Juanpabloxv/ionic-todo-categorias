# ionic-todo-categorias

Aplicación móvil híbrida To-Do List construida con Ionic y Angular para gestionar tareas con categorías, integrando Firebase y Docker.

## Descripción

Este proyecto es una app para gestionar listas de tareas con categorías, donde:
- Los usuarios pueden crear, editar y eliminar tareas.
- Cada tarea puede ser asignada a una categoría.
- Las categorías pueden ser creadas, editadas y eliminadas.
- Se pueden filtrar tareas por categoría para una mejor organización.
- Soporte multiplataforma para Android e iOS con compilación usando Cordova.

El proyecto incluye:
- Aplicación híbrida Ionic + Angular.
- Firebase para autenticación y sincronización.
- Docker para contenerizar la aplicación y facilitar el desarrollo.
- Generación de APK e IPA para pruebas en dispositivos físicos o emuladores.

---

## Requisitos

- **Solo necesitas tener instalado Docker o Docker Desktop.**
> No es necesario tener instalado Node.js, Ionic CLI ni ninguna otra dependencia técnica, ya que Docker se encarga de contenerizar y gestionar todo lo necesario.

---

## Instalación y Uso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Juanpabloxv/ionic-todo-categorias.git
cd ionic-todo-categorias
```

### 2. Levantar el Proyecto con Docker

Asegúrate de tener Docker corriendo y luego ejecuta:

```bash
docker-compose up -d
```

> ⚠️ Asegúrate de ejecutar este comando en la misma ruta donde está el archivo `docker-compose.yml`.

Esto levantará la aplicación de forma local en el navegador.

> La aplicación utilizará los siguientes puertos, asegúrate de que estén libres antes de ejecutar:
> - `8100:8100` (Ionic App)
> - `35729:35729` (Live Reload)

---

### 🌐 Acceso en la nube

Puedes consultar el aplicativo frontend desplegado en la siguiente URL:

**👉 [http://89.116.26.26:8100](http://89.116.26.26:8100)**

---

### 📱 Archivo APK generado

El archivo APK compilado para Android ya se encuentra disponible en esta misma carpeta, junto a este archivo `README.md`. Puedes transferirlo a tu dispositivo Android para instalarlo y probar la aplicación sin necesidad de compilarla.

---

### 3. Detener la Aplicación

```bash
docker-compose down
```

Si deseas eliminar volúmenes y reiniciar todo:

```bash
docker-compose down --volumes
```

---

## Características Principales

- [x] CRUD completo de tareas.
- [x] Gestión completa de categorías (crear, editar, eliminar).
- [x] Asignación y filtrado de tareas por categoría.
- [x] Multiplataforma: Android e iOS mediante Cordova.
- [x] Contenerización con Docker para desarrollo y despliegue.
- [x] Exportación de APK e IPA para pruebas.

---

## Estructura del Proyecto

- `src/app/` → Código fuente Angular e Ionic
- `src/environments/` → Configuraciones de entorno
- `docker/` → Archivos para contenerización con Docker
- `resources/` → Recursos para plataformas móviles (iconos, splash)
- `www/` → Código generado para producción

---

## Información Adicional

- Aunque puedes ejecutar la aplicación con Ionic CLI de manera local, **se recomienda usar Docker y Docker Compose para evitar problemas de configuración**.
- Para pruebas en dispositivos reales, se deben generar y firmar los APK e IPA.
- Ya se encuentra disponible una versión desplegada en la nube.
- El APK se encuentra adjunto localmente para pruebas rápidas en Android.

---

## Contribuciones

Puedes contribuir con mejoras, reportar errores o sugerir nuevas funcionalidades en el [repositorio de GitHub](https://github.com/Juanpabloxv/ionic-todo-categorias).

---

## Licencia

Creado por: Juan Pablo Herrera Herrera