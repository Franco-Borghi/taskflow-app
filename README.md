# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

Los textos de la app están en inglés. Donde el enunciado pide un texto puntual en español, hay un comentario en el código que lo indica.

## Checkpoints

- **Checkpoint 1: Estructura base.** Proyecto inicializado, arquitectura de carpetas y pantalla de bienvenida.
- **Checkpoint 2: Pantallas iniciales y tarjeta de perfil.** Pantallas `HomeScreen` y `ProfileScreen`, componente reutilizable `ProfileCard` y sistema de estilos centralizado.
- **Checkpoint 3: Formulario de creación de tareas.** Botón "+ Add" en la `HomeScreen` que abre un modal con un formulario controlado, validaciones y feedback visual. Las tareas guardadas se muestran en la lista de la Home.
- **Checkpoint 4: Lista de tareas con detalle.** Estado vacío con el componente `EmptyState`, y pantalla `TaskDetailScreen` que se abre al tocar una tarea, con botones para volver a la lista y para borrar la tarea.
- **Checkpoint 5: Navegación.** React Navigation con un `Tab.Navigator` (Home y Profile) y un `Stack.Navigator` anidado en Home para el flujo de tareas (`TaskList`, `TaskDetail` y `TaskForm`). La tarea seleccionada viaja por `route.params` y el formulario vuelve a la lista solo al guardar.

## Navegación

La navegación usa React Navigation 7. Toda la configuración vive en `src/navigation/`:

- `AppNavigator.tsx`: el `NavigationContainer`, con un tema armado con la paleta de la app, y el `Tab.Navigator` raíz.
- `TasksStackNavigator.tsx`: el `Stack.Navigator` del flujo de tareas.
- `types.ts`: las rutas de cada navegador y sus parámetros.
- `headerOptions.ts`: el estilo del header que comparten las pestañas y el stack (fondo naranja y título blanco centrado).

### Estructura

```
NavigationContainer
└─ Tab.Navigator
   ├─ Home ──→ Stack.Navigator
   │            ├─ TaskList     (ruta inicial)
   │            ├─ TaskDetail   { task }
   │            └─ TaskForm
   └─ Profile ─→ ProfileScreen
```

- **`Tab.Navigator` (raíz):** las dos secciones de la app, al mismo nivel. Cada pestaña tiene un ícono de `Ionicons` (`@expo/vector-icons`), relleno cuando está activa. Las pestañas conservan su estado: si estás en el detalle de una tarea, vas a Profile y volvés, seguís en el detalle.
- **`Stack.Navigator` (dentro de Home):** el flujo de tareas. Cada pantalla se apila sobre la lista y "atrás" la saca, así que la lista vuelve a verse tal como estaba. El stack se encarga del header con el título de cada pantalla, del botón atrás de Android y del gesto de deslizar desde el borde en iOS.
- La pestaña Home oculta su propio header (`headerShown: false`) para que no se vean dos. El que se ve es el del stack, que cambia el título según la pantalla y muestra el botón atrás (`BackButton`).
- Títulos del header: "Home" (`TaskList`), "Task detail", "New task" y "Profile".

### Flujo

| Acción                                                  | Llamada                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| Tocar una tarea en la lista                             | `navigation.navigate('TaskDetail', { task })`                       |
| "+ Add" en la lista                                     | `navigation.navigate('TaskForm')`                                   |
| "Save" en el formulario                                 | `navigation.navigate('TaskList', { newTask }, { pop: true })`       |
| "Cancel" en el formulario                               | `navigation.goBack()`                                               |
| "Delete task" en el detalle                             | `navigation.navigate('TaskList', { deletedTaskId }, { pop: true })` |
| Botón atrás del header (`BackButton`)                   | `navigation.goBack()`                                               |
| Botón atrás de Android o deslizar desde el borde en iOS | Lo maneja el stack                                                  |

Las pantallas usan los hooks `useNavigation` y `useRoute`, tipados con `TasksStackParamList`.

### Decisiones

- **Las tareas viajan por parámetros.** Todavía no hay estado global (llega con Redux en el Módulo 6), así que la lista es la dueña de las tareas y las otras pantallas se comunican con ella por `route.params`:
  - El detalle recibe la tarea entera y no solo el ID, porque sin estado compartido no tendría de dónde sacar el resto de los datos. El ID viaja dentro de la tarea.
  - El formulario devuelve la tarea nueva en `newTask`, y el detalle devuelve el ID de la tarea borrada en `deletedTaskId`.
- **`createdAt` es un string ISO.** React Navigation avisa cuando hay valores no serializables en los parámetros, y un `Date` no se puede serializar. Por eso la fecha se guarda como string, y el detalle la convierte a `Date` solo para mostrarla.
- **`navigate` con `{ pop: true }`.** En React Navigation 7, `navigate('TaskList')` ya no vuelve a una pantalla que está más abajo en el stack: apila una nueva. Sin la opción `pop`, después de guardar quedarían dos listas apiladas y el botón atrás volvería al formulario. Con `{ pop: true }`, vuelve a la `TaskList` que ya existe y le reemplaza los parámetros.
- **Cómo aplica la lista `newTask` y `deletedTaskId`.** La lista guarda en un estado el último valor que ya procesó (`handledNewTask` y `handledDeletedTaskId`). Cuando llega un parámetro distinto, aplica el cambio una sola vez, durante el render. No uso `useEffect` porque la regla `react-hooks/set-state-in-effect` lo marca: actualizar el estado en un efecto, como reacción a un cambio de props, genera un render de más. Es el patrón que recomienda React en [Adjusting some state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
- **El formulario es una pantalla del stack, no un modal.** Tiene el header con "New task" y el botón atrás, y la barra de pestañas sigue visible.
- **Botón atrás propio.** El stack usa `BackButton` en `headerLeft`, igual en iOS y Android. Desde iOS 26, el botón atrás nativo va dentro de una burbuja de vidrio (Liquid Glass) que agranda el header, y React Navigation no tiene una opción estable para sacarla. Con un `headerLeft` propio y `headerLeftBackgroundVisible: false`, el tamaño y el color los define la app. Lo que se pierde en iOS es el menú que aparece al mantener apretado el botón atrás. El gesto de deslizar para volver y el botón atrás de Android siguen funcionando porque los maneja el stack.

## Pantallas

Todas las pantallas están en `src/screens/` y cada una es una ruta de un navegador. Se visualizan correctamente en Expo Go.

### TaskListScreen

Es la ruta inicial del stack de la pestaña Home, así que es lo primero que se ve al abrir la app. Muestra mi `ProfileCard` y la sección "My tasks" con la lista de tareas.

- La lista es un `FlatList` que scrollea toda la pantalla: la `ProfileCard` y el título "My tasks" van en el `ListHeaderComponent`.
- Cuando no hay tareas, el `ListEmptyComponent` muestra el `EmptyState`, que invita a crear la primera tarea. Uso `ListEmptyComponent` en vez de un ternario sobre `tasks.length` porque la `ProfileCard` y el botón "+ Add" están en el header de la lista: con un ternario desaparecerían junto con la lista y no habría forma de crear la primera tarea.
- El botón "+ Add" abre la `TaskFormScreen`. Al guardar, la tarea se agrega al principio de la lista.
- Al tocar una tarea se abre su detalle (`TaskDetailScreen`).
- Las tareas viven en un estado local (`useState`) de la `TaskListScreen`. Como la pestaña no se desmonta, se mantienen al ir a Profile y volver, pero se pierden al cerrar la app.

### TaskDetailScreen

Muestra el detalle de la tarea que recibe en `route.params.task`: título, categoría, descripción completa y fecha de creación.

- Para volver a la lista se usa el botón atrás del header, el botón atrás de Android o el gesto de deslizar desde el borde en iOS.
- "Delete task" pide confirmación con un `Alert` y vuelve a la lista con el `deletedTaskId`. Si era la última tarea, aparece el estado vacío.

### TaskFormScreen

Muestra el `TaskForm` dentro de una tarjeta.

- "Save" valida el formulario, vuelve a la lista con la tarea nueva en `newTask` y muestra el `Alert` "Success / Task saved locally".
- "Cancel" vuelve a la lista sin guardar.
- Usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado. Como `KeyboardAvoidingView` calcula su posición sin contar el header, le paso la altura del header en `keyboardVerticalOffset`, que se obtiene con `useHeaderHeight` de `@react-navigation/elements`.

### ProfileScreen

Es la pestaña Profile. Renderiza una lista de `ProfileCard` con datos de prueba (mi perfil y el de un equipo ficticio) usando `FlatList`. Cada tarjeta recibe datos distintos, lo que demuestra que el componente es reutilizable.

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
  2. Se la pasa a `TaskFormScreen` con `onSave`, y la pantalla vuelve a la lista con la tarea en los parámetros.
  3. Limpia los campos con `resetForm`, así el formulario vuelve a su estado inicial.
  4. Muestra el `Alert` "Success / Task saved locally".
- **UX mobile:**
  - El título usa `autoCapitalize="sentences"` y `returnKeyType="next"`, que pasa el foco a la descripción.
  - La descripción es multilínea.
  - La pantalla usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado.

## Componentes

- `ProfileCard`: tarjeta de perfil reutilizable. Recibe `name`, `role` e `image` por props, sin datos fijos adentro. `image` acepta tanto una imagen local (`require('@assets/images/...')`) como una remota (`{ uri: 'https://...' }`).
- `Typography`: textos con los tamaños y colores del tema.
- `TaskForm`: formulario de creación de tareas, con los botones "Cancel" y "Save". Lo usa la `TaskFormScreen`.
- `TaskCard`: tarjeta de una tarea en la lista, con título, categoría y descripción. Al tocarla se abre el detalle.
- `CategoryBadge`: etiqueta con el nombre de la categoría. La usan `TaskCard` y `TaskDetailScreen`.
- `EmptyState`: mensaje con ícono para cuando una lista está vacía. Recibe `icon`, `title` y `message` por props.
- `TextField`: `TextInput` con label, texto de ayuda y mensaje de error. Cambia el color del borde según el foco o el error, y acepta todas las props de `TextInput`.
- `CategoryPicker`: set de botones (`TouchableOpacity`) para elegir la categoría de la tarea.
- `Button`: botón hecho con `TouchableOpacity`, con variantes `primary`, `secondary` y `danger` (para acciones como borrar), tamaños `medium` y `small`, y estado deshabilitado.
- `BackButton`: botón atrás del header. Es un círculo con el color de fondo de las pantallas y el `chevron-back` de `Ionicons` en naranja, del mismo tamaño que el título del header (17). Lo usan todas las pantallas del stack menos la primera.

## Sistema de estilos

Todos los estilos usan `StyleSheet.create` en archivos `*.styles.ts` separados de cada componente. Las constantes de diseño viven en `src/constants/`:

- `colors.ts`: paleta de colores (primary, background, surface, text, etc.)
- `paddings.ts`: espaciados
- `borderRadius.ts`: bordes redondeados
- `boxShadows.ts`: sombras
- `taskCategories.ts`: categorías disponibles para las tareas y la categoría por defecto

El header y la barra de pestañas usan los mismos colores, a través del tema del `NavigationContainer` y de `headerOptions.ts`.

## Tecnologías

- Expo SDK 58
- React Native
- TypeScript
- React Navigation 7 (`native`, `bottom-tabs`, `native-stack` y `elements`)
- @expo/vector-icons
- react-native-safe-area-context
- ESLint + Prettier

## Estructura del proyecto

El código vive en `src/`, organizado en:

- `assets/`: imágenes y fuentes locales (`assets/images/`)
- `components/`: componentes reutilizables de UI
- `screens/`: pantallas de la app (cada una es una ruta de un navegador)
- `navigation/`: navegadores, tipos de las rutas y estilo del header
- `constants/`: constantes de diseño (colores, espaciados, bordes y sombras) y categorías de tareas
- `entities/`: tipos de las entidades de la app (por ahora, `Task`)

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Task } from '@entities/task';
```

Alias disponibles: `@assets`, `@components`, `@screens`, `@navigation`, `@constants`, `@entities`.

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
