# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

## Checkpoints

- **Checkpoint 1: Estructura base.** Proyecto inicializado, arquitectura de carpetas y pantalla de bienvenida.
- **Checkpoint 2: Pantallas iniciales y tarjeta de perfil.** Pantallas `HomeScreen` y `ProfileScreen`, componente reutilizable `ProfileCard` y sistema de estilos centralizado.
- **Checkpoint 3: Formulario de creación de tareas.** Botón "+ Add" en la `HomeScreen` que abre un modal con un formulario controlado, validaciones y feedback visual. Las tareas guardadas se muestran en la lista de la Home.

## Pantallas

Todas las pantallas se visualizan correctamente en Expo Go.

### HomeScreen

Es la pantalla que se muestra al abrir la app (`App.tsx`). Muestra mi `ProfileCard` y la sección "My tasks" con la lista de tareas.

- La lista es un `FlatList` que scrollea toda la pantalla: la `ProfileCard` y el título "My tasks" van en el `ListHeaderComponent`, y el estado vacío ("No tasks yet") en el `ListEmptyComponent`.
- El botón "+ Add" abre el `AddTaskModal`. Al guardar, la tarea se agrega al principio de la lista.
- Por ahora las tareas viven en un estado local (`useState`) de la `HomeScreen`, así que se pierden al cerrar la app o cambiar de pantalla.

### ProfileScreen

Renderiza una lista de `ProfileCard` con datos de prueba (mi perfil y el de un equipo ficticio) usando `FlatList`. Cada tarjeta recibe datos distintos, lo que demuestra que el componente es reutilizable.

Hasta tener la navegación, para verla hay que cambiar la pantalla que renderiza `App.tsx`:

```tsx
import { ProfileScreen } from '@screens/ProfileScreen/ProfileScreen';

// ...
<SafeAreaProvider>
	<ProfileScreen />
</SafeAreaProvider>;
```

## Formulario de tareas

El formulario (`TaskForm`) captura título, descripción y categoría. Toda su lógica vive en el hook `useTaskForm`.

- **Componentes controlados:** cada campo tiene su propio `useState` y los `TextInput` están vinculados con `value` y `onChangeText`.
- **Validaciones:**
  - Título: obligatorio, mínimo 5 caracteres.
  - Descripción: obligatoria, mínimo 10 caracteres.
  - Categoría: siempre hay una seleccionada (`Personal` por defecto).
  - Los espacios al principio y al final no cuentan, así que un campo con solo espacios es inválido.
- **Feedback visual:**
  - El error de cada campo se calcula al salir del campo (`onBlur`) y se borra apenas el usuario vuelve a escribir en él (`onChangeText`).
  - Al tocar "Save" se validan todos los campos.
  - Los errores aparecen en rojo debajo del campo. Mientras no hay error, se muestra un texto de ayuda con el mínimo de caracteres.
  - El borde del input se pone naranja con foco y rojo con error.
  - El botón "Save" se deshabilita mientras haya errores.
- **Envío simulado (`handleAddTask`):** primero valida todos los campos con `validateForm`. Si los datos son válidos:
  1. Arma la tarea (`{ id, title, description, category, createdAt }`) y la imprime en consola.
  2. La manda a la `HomeScreen`, que la agrega a la lista y cierra el modal.
  3. Limpia los campos con `resetForm`, así el formulario vuelve a su estado inicial.
  4. Muestra el `Alert` "Éxito / Tarea capturada localmente".
- **UX mobile:**
  - El título usa `autoCapitalize="sentences"` y `returnKeyType="next"`, que pasa el foco a la descripción.
  - La descripción es multilínea.
  - El modal usa `KeyboardAvoidingView` para que la tarjeta suba por encima del teclado.

## Componentes

- `ProfileCard`: tarjeta de perfil reutilizable. Recibe `name`, `role` e `image` por props, sin datos fijos adentro. `image` acepta tanto una imagen local (`require('@assets/images/...')`) como una remota (`{ uri: 'https://...' }`).
- `Layout`: estructura común de todas las pantallas, con el `Header` arriba, el contenido en el medio y el `Nav` abajo.
- `Header` y `Nav`: barras superior e inferior. Usan `react-native-safe-area-context` para no quedar debajo de la barra de estado ni de la barra de gestos. El `Nav` aun no tiene los botones de navegación.
- `Typography`: textos con los tamaños y colores del tema.
- `AddTaskModal`: modal con una tarjeta centrada que contiene el `TaskForm`. Se cierra con "Cancel", con "Save" o con el botón atrás de Android.
- `TaskForm`: formulario de creación de tareas, con los botones "Cancel" y "Save".
- `TaskCard`: tarjeta de una tarea en la lista, con título, categoría y descripción.
- `TextField`: `TextInput` con label, texto de ayuda y mensaje de error. Cambia el color del borde según el foco o el error, y acepta todas las props de `TextInput`.
- `CategoryPicker`: set de botones (`TouchableOpacity`) para elegir la categoría de la tarea.
- `Button`: botón hecho con `TouchableOpacity`, con variantes `primary` y `secondary`, tamaños `medium` y `small`, y estado deshabilitado.

## Sistema de estilos

Todos los estilos usan `StyleSheet.create` en archivos `*.styles.ts` separados de cada componente. Las constantes de diseño viven en `src/constants/`:

- `colors.ts`: paleta de colores (primary, background, surface, text, etc.)
- `paddings.ts`: espaciados
- `borderRadius.ts`: bordes redondeados
- `boxShadows.ts`: sombras
- `taskCategories.ts`: categorías disponibles para las tareas y la categoría por defecto

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
- `constants/`: constantes de diseño (colores, espaciados, bordes y sombras) y categorías de tareas
- `entities/`: tipos de las entidades de la app (por ahora, `Task`)

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Task } from '@entities/task';
```

Alias disponibles: `@assets`, `@components`, `@screens`, `@constants`, `@entities`.

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
