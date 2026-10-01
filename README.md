# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

## Checkpoints

- **Checkpoint 1: Estructura base.** Proyecto inicializado, arquitectura de carpetas y pantalla de bienvenida.
- **Checkpoint 2: Pantallas iniciales y tarjeta de perfil.** Pantallas `HomeScreen` y `ProfileScreen`, componente reutilizable `ProfileCard` y sistema de estilos centralizado.

## Pantallas

Las dos pantallas se visualizan correctamente en Expo Go.

### ProfileScreen

Es la pantalla que se muestra al abrir la app (`App.tsx`). Renderiza una lista de `ProfileCard` con datos de prueba (mi perfil y el de un equipo ficticio) usando `FlatList`. Cada tarjeta recibe datos distintos, lo que demuestra que el componente es reutilizable.

### HomeScreen

Es la pantalla principal, donde se van a ver las tareas. Muestra mi `ProfileCard` y la sección "My tasks", que por ahora tiene un estado vacío.

Hasta tener la navegación, para ver la `HomeScreen` hay que cambiar la pantalla que renderiza `App.tsx`:

```tsx
import { HomeScreen } from '@screens/HomeScreen/HomeScreen';

// ...
<SafeAreaProvider>
	<HomeScreen />
</SafeAreaProvider>;
```

## Componentes

- `ProfileCard`: tarjeta de perfil reutilizable. Recibe `name`, `role` e `image` por props, sin datos fijos adentro. `image` acepta tanto una imagen local (`require('@assets/images/...')`) como una remota (`{ uri: 'https://...' }`).
- `Layout`: estructura común de todas las pantallas, con el `Header` arriba, el contenido en el medio y el `Nav` abajo.
- `Header` y `Nav`: barras superior e inferior. Usan `react-native-safe-area-context` para no quedar debajo de la barra de estado ni de la barra de gestos. El `Nav` aun no tiene los botones de navegación.
- `Typography`: textos con los tamaños y colores del tema.

## Sistema de estilos

Todos los estilos usan `StyleSheet.create` en archivos `*.styles.ts` separados de cada componente. Las constantes de diseño viven en `src/constants/`:

- `colors.ts`: paleta de colores (primary, background, surface, text, etc.)
- `paddings.ts`: espaciados
- `borderRadius.ts`: bordes redondeados
- `boxShadows.ts`: sombras

## Tecnologías

- Expo SDK 57
- React Native
- TypeScript
- react-native-safe-area-context
- ESLint + Prettier

## Estructura del proyecto

El código vive en `src/`, organizado en:

- `assets/`: imágenes y fuentes locales (`assets/images/`)
- `components/`: componentes reutilizables de UI
- `screens/`: pantallas principales de la app
- `constants/`: constantes de diseño (colores, espaciados, bordes y sombras)

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
```

Alias disponibles: `@assets`, `@components`, `@screens`, `@constants`.

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
