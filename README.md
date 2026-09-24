# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

Este repositorio contiene el **Checkpoint 1: Estructura Base**: el proyecto inicializado, la arquitectura de carpetas y una pantalla de bienvenida.

## Tecnologías

- Expo SDK 57
- React Native
- TypeScript
- ESLint + Prettier

## Estructura del proyecto

El código vive en `src/`, organizado en:

- `assets/`: imágenes y fuentes locales
- `components/`: componentes reutilizables de UI
- `screens/`: pantallas principales de la app
- `theme/`: paleta de colores y estilos globales

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@theme/colors';
```

Alias disponibles: `@assets`, `@components`, `@screens`, `@theme`.

## Cómo ejecutarlo localmente

Requisitos: [Node.js](https://nodejs.org/) (versión LTS) y la app **Expo Go** en tu celular, o un emulador de Android o iOS.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Franco-Borghi/taskflow-app.git
   cd taskflow-app
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npx expo start
   ```

4. Escanear el código QR con Expo Go (Android) o con la cámara (iOS). También podés presionar `a` para abrir el emulador de Android o `i` para el simulador de iOS.

## Scripts útiles

```bash
npx expo lint     # Revisar el código con ESLint y Prettier
npx tsc --noEmit  # Verificar los tipos de TypeScript
```

## Autor

Franco Borghi
