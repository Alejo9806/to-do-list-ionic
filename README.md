# To-Do Accenture Application 🚀

Una aplicación móvil moderna y optimizada desarrollada con **Ionic** y **Angular**, diseñada para la gestión eficiente de tareas personales con categorización avanzada y alto rendimiento.

---

## 📸 Vista de la Aplicación

| Home Screen | Categorías | Feature Flag |
| :---: | :---: | :---: |
| ![Home](src/assets/screenshot/home.jpeg) | ![Categorias](src/assets/screenshot/Categorias.jpeg) | ![Filtros](src/assets/screenshot/flag.jpeg) |

---

## 📥 Descarga la Aplicación (Android)

Puedes probar la aplicación directamente instalando el archivo APK en tu dispositivo Android:

[**📲 Descargar APK (Debug)**](app-debug.apk)

---


## 🛠️ Tecnologías y Versiones

La aplicación utiliza un stack tecnológico para garantizar estabilidad y velocidad:

- **Ionic Framework:** ^8.0.0 (Componentes UI nativos)
- **Angular:** ^20.0.0 (Framework base)
- **Angular Signals:** Gestión de estado reactiva.
- **Angular CDK:** ^20.0.0 (Virtual Scrolling para rendimiento).
- **Cordova:** Para el puente nativo con Android e iOS.
- **Firebase:** Remote Config para gestión de Feature Flags.

---

## 🏛️ Arquitectura

La aplicación sigue una arquitectura basada en **Servicios y Signals**, priorizando la reactividad y la eficiencia de memoria.

1.  **Capa de Servicio (`TodoService`):** Centraliza la lógica de negocio y el estado global utilizando `signals` y `computed`. Esto elimina la necesidad de suscripciones manuales y previene fugas de memoria (*Memory Leaks*).
2.  **Optimización de Renderizado:** Se implementó **Virtual Scrolling** (`@angular/cdk/scrolling`) en la lista de tareas. Esto permite manejar miles de elementos en el DOM sin degradar el rendimiento del dispositivo, reciclando dinámicamente los nodos visibles.
3.  **Persistencia:** Gestión de datos locales optimizada.
4.  **Diseño Premium:** Estilos basados en Vanilla SCSS con un sistema de diseño limpio, sombras dinámicas y micro-animaciones.

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
- Node.js (Versión LTS recomendada)
- Ionic CLI: `npm install -g @ionic/cli`

### Pasos
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en el navegador:
   ```bash
   ionic serve
   ```

---

## 📱 Integración con Cordova y Builds

La aplicación utiliza Cordova para empaquetar el código web en contenedores nativos.

### Requisitos para Android
- **Android Studio** instalado.
- **Android SDK Command-line Tools (latest)** descargadas desde el SDK Manager.
- Variable de entorno `ANDROID_HOME` configurada.
- **Gradle** instalado y agregado al PATH del sistema.

### Generar Builds

#### Android (APK)
```bash
ionic cordova build android
```
El archivo resultante se encuentra en: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

#### iOS (IPA)
> [!IMPORTANT]
> Para compilar en iOS es **obligatorio** el uso de una computadora con **macOS** y tener instalado **Xcode**.

```bash
ionic cordova build ios
```
Este comando genera un proyecto de Xcode que luego debe ser firmado y compilado desde la herramienta de Apple.

---

## 🤖 Uso del Emulador de Android

Para visualizar cambios en tiempo real en un emulador mientras se desarrolla:

1. Abrir Android Studio y lanzar un Dispositivo Virtual.
2. Ejecutar el comando de Live Reload:
   ```bash
   ionic cordova run android -l --external
   ```
3. Selecciona la IP de tu red local cuando la terminal lo solicite para habilitar la conexión entre el servidor de desarrollo y el emulador.

> [!NOTE]
> Se han configurado excepciones de `cleartextTraffic` en `network_security_config.xml` para permitir la conexión HTTP del servidor de desarrollo en dispositivos Android 9+.

---

## 🚩 Firebase Remote Config & Feature Flags

Se integró **Firebase Remote Config** para permitir el control de funcionalidades en tiempo real sin necesidad de actualizar la App en la tienda.

### Feature Flag: `change_banner`
- **Descripción:** Controla dinámicamente el comportamiento o estilo del encabezado de la aplicación.
- **Servicio:** `FeatureFlagService` gestiona la inicialización de Firebase y la recuperación de valores.
- **Configuración:** Las credenciales se encuentran protegidas en los archivos `src/environments/environment.ts`.

---

## 📝 Reflexión sobre el Desarrollo

### 1. ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?
- **Gestión de Estado Reactivo:** Asegurar que el filtrado por categorías fuera instantáneo y eficiente. Se resolvió usando **Angular Signals** y `computed`, permitiendo una lógica declarativa y automática.
- **UX Nativa:** Implementar la gestión de categorías mediante `ActionSheetController` y `AlertController` para mantener una experiencia fluida y móvil, evitando formularios web complejos.
- **Consistencia de Datos:** Manejar la persistencia en `localStorage` asegurando que las tareas no quedaran sin la categoría asignada al editar o eliminar categorías.

### 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
- **Virtual Scrolling (Angular CDK):** Se implementó para manejar listas masivas de tareas. Solo se renderizan los elementos visibles en pantalla, reduciendo drásticamente el uso de memoria.
- **Angular Signals:** Permiten una detección de cambios granular, evitando ciclos innecesarios de revisión en todo el árbol de componentes (comparado con la detección de cambios tradicional de Angular).
- **Lazy Loading:** El proyecto está estructurado para cargar el módulo `Home` de forma diferida. Esto significa que el código de la gestión de tareas solo se descarga cuando el usuario entra en esa sección, optimizando el tiempo de "Primer Pintado" de la aplicación al iniciar.

### 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?
- **Arquitectura desacoplada:** Separé completamente la lógica de negocio de la lógica de presentación. Todo el manejo de datos (CRUD) reside en TodoService. Esto facilita la mantenibilidad: si mañana decidimos cambiar localStorage por una base de datos real (como Firebase), solo hay que tocar el servicio; el componente de la vista seguirá funcionando igual.
- **Tipado Estricto:** Uso de interfaces TypeScript (`Task`, `Category`) para garantizar la integridad de los datos y facilitar el refactor.


---

## 📂 Estructura del Proyecto

- `src/app/services`: Lógica de negocio (Tasks, Categories, Feature Flags).
- `src/app/models`: Interfaces de datos.
- `src/app/home`: Componente principal de la interfaz.
- `resources/`: Íconos y Splash Screens de la aplicación.
- `config.xml`: Configuración nativa de Cordova.
