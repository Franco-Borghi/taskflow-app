# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

Los textos de la app están en inglés. Donde el enunciado pedía un texto puntual en español, se usó su equivalente en inglés:

- Estado vacío de la lista (Checkpoint 4): "You have no pending tasks!" / "Start by creating one with the + Add button above." en lugar de "¡No tienes tareas pendientes! Empieza por crear una arriba."
- `Alert` al guardar una tarea (Checkpoint 3): "Success" / "Task saved locally" en lugar de "Éxito" / "Tarea capturada localmente".

## Checkpoints

- **Checkpoint 1: Estructura base.** Proyecto inicializado, arquitectura de carpetas y pantalla de bienvenida.
- **Checkpoint 2: Pantallas iniciales y tarjeta de perfil.** Pantallas `HomeScreen` y `ProfileScreen`, componente reutilizable `ProfileCard` y sistema de estilos centralizado.
- **Checkpoint 3: Formulario de creación de tareas.** Botón "+ Add" en la `HomeScreen` que abre un modal con un formulario controlado, validaciones y feedback visual. Las tareas guardadas se muestran en la lista de la Home.
- **Checkpoint 4: Lista de tareas con detalle.** Estado vacío con el componente `EmptyState`, y pantalla `TaskDetailScreen` que se abre al tocar una tarea, con botones para volver a la lista y para borrar la tarea.
- **Checkpoint 5: Navegación.** React Navigation con un `Tab.Navigator` (Home y Profile) y un `Stack.Navigator` anidado en Home para el flujo de tareas (`TaskList`, `TaskDetail` y `TaskForm`). La tarea seleccionada viaja por `route.params` y el formulario vuelve a la lista solo al guardar.
- **Checkpoint 6: Estado global con Redux Toolkit.** Las tareas y el filtro viven en un store de Redux (`createSlice` y `configureStore`). La lista, el detalle y el formulario leen y modifican el mismo store, así que un cambio hecho en una pantalla se ve en todas. Se pueden crear, editar, completar y borrar tareas, y filtrarlas por estado.

## Estado global (Redux)

El estado de las tareas vive en un store de Redux Toolkit. Toda la lógica de estado está en `src/store/`:

- `store.ts`: crea el store con `configureStore` y exporta los tipos `RootState` y `AppDispatch`.
- `taskSlice.ts`: el slice `tasks`, hecho con `createSlice`, con sus acciones y selectores.
- `hooks.ts`: `useAppSelector` y `useAppDispatch`, las versiones tipadas de `useSelector` y `useDispatch`.

`App.tsx` envuelve toda la app con `<Provider store={store}>`, así todas las pantallas de la navegación tienen acceso al store.

### Estado

```ts
type TasksState = {
	items: Task[];
	filter: 'all' | 'pending' | 'completed';
};
```

- `items` son las tareas, la más nueva primero. Arranca con 4 tareas de ejemplo (2 pendientes y 2 completadas, una de cada categoría) para poder probar la lista y el filtro sin cargar datos.
- `filter` es el filtro de la lista. Arranca en `'all'`.

### Acciones

| Acción             | Payload                             | Qué hace                                                                                                                        | Dónde se despacha                          |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `addTask`          | `{ title, description, category }`  | Agrega una tarea al principio de la lista. El `prepare` genera el `id` con `nanoid`, la fecha de creación y `completed: false`. | "Save" en `TaskFormScreen`, al crear       |
| `updateTask`       | `{ id, changes }`                   | Cambia el título, la descripción y la categoría de una tarea.                                                                   | "Save" en `TaskFormScreen`, al editar      |
| `toggleTaskStatus` | `id`                                | Marca la tarea como completada o como pendiente.                                                                                | Checkbox de `TaskCard` y botón del detalle |
| `deleteTask`       | `id`                                | Borra la tarea.                                                                                                                 | "Delete task" en el detalle                |
| `setFilter`        | `'all' \| 'pending' \| 'completed'` | Cambia el filtro de la lista.                                                                                                   | `TaskFilterPicker` en la lista             |

### Selectores

- `selectTasks`: todas las tareas.
- `selectTaskById(state, taskId)`: una tarea por su ID. Lo usan el detalle y el formulario en modo edición.
- `selectTaskFilter`: el filtro actual.
- `selectFilteredTasks`: las tareas que corresponden al filtro. Está hecho con `createSelector`, que recuerda el último resultado: mientras las tareas y el filtro no cambien, devuelve el mismo array. Si devolviera un array nuevo en cada render, `useSelector` avisaría con un warning y la lista se volvería a renderizar sin motivo.

### Flujo de datos

```
                   dispatch(acción)                  useAppSelector(selector)
TaskListScreen   ─┐                               ┌─→ TaskListScreen
TaskDetailScreen ─┼──→   store (tasks)   ─────────┼─→ TaskDetailScreen
TaskFormScreen   ─┘                               └─→ TaskFormScreen
```

Las pantallas no se pasan tareas entre sí: cada una lee del store lo que necesita y despacha acciones para cambiarlo. Por eso, si marcás una tarea como completada en el detalle o la editás en el formulario, al volver la lista ya muestra el cambio. Y como el filtro también está en el store, se mantiene al cambiar de pestaña.

### Decisiones

- **Hooks tipados.** `useAppSelector = useSelector.withTypes<RootState>()` y `useAppDispatch = useDispatch.withTypes<AppDispatch>()` son `useSelector` y `useDispatch` con los tipos del store ya aplicados, así no hay que escribir `(state: RootState)` en cada uso. Es lo que recomienda la documentación de Redux Toolkit para TypeScript.
- **El `id` y la fecha se generan en el `prepare` de `addTask`.** Un reducer tiene que ser puro: con la misma acción, siempre el mismo resultado. Generar un ID o leer la fecha actual no lo es, así que eso pasa en el `prepare`, que arma la tarea completa antes de que llegue al reducer.
- **Los reducers "mutan" el estado.** `state.items.unshift(...)` o `task.completed = !task.completed` parecen mutaciones, pero Redux Toolkit usa Immer por detrás y genera un estado nuevo.
- **`createdAt` es un string ISO.** Redux Toolkit avisa cuando hay valores no serializables en el estado (y React Navigation, cuando los hay en los parámetros), y un `Date` no se puede serializar. Por eso la fecha se guarda como string, y el detalle la convierte a `Date` solo para mostrarla.
- **Componentes puros.** `TaskCard`, `TaskFilterPicker` y `TaskForm` no conocen Redux: reciben datos y callbacks por props. Las pantallas son las que leen del store y despachan acciones.
- **El detalle recibe solo el `taskId`.** Busca la tarea en el store, así que cualquier cambio (completarla desde la lista, editarla) se ve al instante. Al borrarla, el detalle no renderiza nada mientras se cierra, porque la tarea ya no existe en el store.
- **Sin persistencia todavía.** El store vive en memoria: los cambios se mantienen mientras la app está abierta y se pierden al cerrarla. La persistencia con Firebase llega en el Módulo 7.

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
   │            ├─ TaskDetail   { taskId }
   │            └─ TaskForm     { taskId? }
   └─ Profile ─→ ProfileScreen
```

- **`Tab.Navigator` (raíz):** las dos secciones de la app, al mismo nivel. Cada pestaña tiene un ícono de `Ionicons` (`@expo/vector-icons`), relleno cuando está activa. Las pestañas conservan su estado: si estás en el detalle de una tarea, vas a Profile y volvés, seguís en el detalle.
- **`Stack.Navigator` (dentro de Home):** el flujo de tareas. Cada pantalla se apila sobre la lista y "atrás" la saca, así que la lista vuelve a verse tal como estaba. El stack se encarga del header con el título de cada pantalla, del botón atrás de Android y del gesto de deslizar desde el borde en iOS.
- La pestaña Home oculta su propio header (`headerShown: false`) para que no se vean dos. El que se ve es el del stack, que cambia el título según la pantalla y muestra el botón atrás (`BackButton`).
- Títulos del header: "Home" (`TaskList`), "Task detail", "New task" o "Edit task" (`TaskForm`, según si recibe un `taskId`) y "Profile".

### Flujo

| Acción                                                  | Llamada                                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Tocar una tarea en la lista                             | `navigation.navigate('TaskDetail', { taskId })`                                        |
| "+ Add" en la lista                                     | `navigation.navigate('TaskForm')`                                                      |
| "Edit task" en el detalle                               | `navigation.navigate('TaskForm', { taskId })`                                          |
| "Save" al crear                                         | `dispatch(addTask(...))` y `navigation.navigate('TaskList', undefined, { pop: true })` |
| "Save" al editar                                        | `dispatch(updateTask(...))` y `navigation.goBack()`                                    |
| "Cancel" en el formulario                               | `navigation.goBack()`                                                                  |
| "Delete task" en el detalle                             | `dispatch(deleteTask(id))` y `navigation.goBack()`                                     |
| Botón atrás del header (`BackButton`)                   | `navigation.goBack()`                                                                  |
| Botón atrás de Android o deslizar desde el borde en iOS | Lo maneja el stack                                                                     |

Las pantallas usan los hooks `useNavigation` y `useRoute`, tipados con `TasksStackParamList`.

### Decisiones

- **La navegación solo lleva IDs.** Desde el Checkpoint 6 las tareas viven en el store, así que la navegación solo pasa el `taskId` y cada pantalla busca la tarea en el store. En el Checkpoint 5, sin estado global, la tarea entera viajaba por parámetros, y la lista recibía de vuelta por `route.params` las tareas nuevas y las borradas.
- **`navigate` con `{ pop: true }`.** En React Navigation 7, `navigate('TaskList')` ya no vuelve a una pantalla que está más abajo en el stack: apila una nueva. Sin la opción `pop`, después de crear una tarea quedarían dos listas apiladas y el botón atrás volvería al formulario. Con `{ pop: true }`, vuelve a la `TaskList` que ya existe.
- **El formulario es una pantalla del stack, no un modal.** Tiene el header con "New task" o "Edit task" y el botón atrás, y la barra de pestañas sigue visible.
- **Botón atrás propio.** El stack usa `BackButton` en `headerLeft`, igual en iOS y Android. Desde iOS 26, el botón atrás nativo va dentro de una burbuja de vidrio (Liquid Glass) que agranda el header, y React Navigation no tiene una opción estable para sacarla. Con un `headerLeft` propio y `headerLeftBackgroundVisible: false`, el tamaño y el color los define la app. Lo que se pierde en iOS es el menú que aparece al mantener apretado el botón atrás. El gesto de deslizar para volver y el botón atrás de Android siguen funcionando porque los maneja el stack.

## Pantallas

Todas las pantallas están en `src/screens/` y cada una es una ruta de un navegador. Se visualizan correctamente en Expo Go.

### TaskListScreen

Es la ruta inicial del stack de la pestaña Home, así que es lo primero que se ve al abrir la app. Muestra mi `ProfileCard` y la sección "My tasks", con el filtro y la lista de tareas.

- La lista es un `FlatList` que scrollea toda la pantalla: la `ProfileCard`, el título "My tasks", el botón "+ Add" y el filtro van en el `ListHeaderComponent`.
- Las tareas salen del store, ya filtradas, con `useAppSelector(selectFilteredTasks)`.
- El filtro (`TaskFilterPicker`) tiene tres opciones: All, Pending y Completed. Al tocar una se despacha `setFilter`.
- Cada tarjeta tiene un checkbox que despacha `toggleTaskStatus`. Tocar el resto de la tarjeta abre el detalle (`TaskDetailScreen`).
- Cuando no hay tareas para mostrar, el `ListEmptyComponent` muestra un `EmptyState` con un mensaje distinto según el filtro. Uso `ListEmptyComponent` en vez de un ternario sobre `tasks.length` porque la `ProfileCard`, el botón "+ Add" y el filtro están en el header de la lista: con un ternario desaparecerían junto con la lista y no habría forma de crear una tarea ni de cambiar el filtro.
- El botón "+ Add" abre la `TaskFormScreen`. Al guardar, la tarea aparece al principio de la lista.

### TaskDetailScreen

Recibe el `taskId` en `route.params` y busca la tarea en el store con `selectTaskById`. Es de solo lectura: muestra el título, la categoría, el estado (Pending o Completed), la descripción completa y la fecha de creación.

- "Edit task" abre la `TaskFormScreen` en modo edición.
- "Mark as completed" / "Mark as pending" despacha `toggleTaskStatus`. El cambio se ve al instante en el detalle y en la lista.
- "Delete task" pide confirmación con un `Alert`, despacha `deleteTask` y vuelve a la lista.
- Para volver a la lista se usa el botón atrás del header, el botón atrás de Android o el gesto de deslizar desde el borde en iOS.

### TaskFormScreen

Muestra el `TaskForm` dentro de una tarjeta. Sirve para crear y para editar, según si recibe un `taskId`:

- **Crear** (sin `taskId`): título "New task" y campos vacíos. "Save" despacha `addTask` y vuelve a la lista.
- **Editar** (con `taskId`): título "Edit task" y campos cargados con la tarea, que busca en el store. "Save" despacha `updateTask` y vuelve al detalle, que ya muestra los datos nuevos.
- En los dos casos, "Save" muestra el `Alert` "Success / Task saved locally", y "Cancel" vuelve sin guardar.
- Usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado. Como `KeyboardAvoidingView` calcula su posición sin contar el header, le paso la altura del header en `keyboardVerticalOffset`, que se obtiene con `useHeaderHeight` de `@react-navigation/elements`.

### ProfileScreen

Es la pestaña Profile. Renderiza una lista de `ProfileCard` con datos de prueba (mi perfil y el de un equipo ficticio) usando `FlatList`. Cada tarjeta recibe datos distintos, lo que demuestra que el componente es reutilizable.

## Formulario de tareas

El formulario (`TaskForm`) captura título, descripción y categoría. Toda su lógica vive en el hook `useTaskForm`. No conoce Redux: devuelve los valores con `onSave`, y la pantalla decide qué acción despachar.

- **Componentes controlados:** cada campo tiene su propio `useState` y los `TextInput` están vinculados con `value` y `onChangeText`. Si recibe `initialValues` (al editar), los campos arrancan con esos valores.
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
- **Guardado (`handleSave`):** primero valida todos los campos con `validateForm`. Si los datos son válidos:
  1. Le pasa a la pantalla, con `onSave`, los valores sin los espacios del principio y del final (`{ title, description, category }`).
  2. Muestra el `Alert` "Success / Task saved locally".
- **No se limpia al guardar.** El formulario es una pantalla que se cierra al guardar, así que la próxima vez que se abre arranca de cero (o con los datos de la tarea, al editar). Si se limpiara, durante la animación de cierre se verían los campos vacíos.
- **UX mobile:**
  - El título usa `autoCapitalize="sentences"` y `returnKeyType="next"`, que pasa el foco a la descripción.
  - La descripción es multilínea.
  - La pantalla usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado.

## Componentes

- `ProfileCard`: tarjeta de perfil reutilizable. Recibe `name`, `role` e `image` por props, sin datos fijos adentro. `image` acepta tanto una imagen local (`require('@assets/images/...')`) como una remota (`{ uri: 'https://...' }`).
- `Typography`: textos con los tamaños y colores del tema.
- `TaskForm`: formulario para crear y editar tareas, con los botones "Cancel" y "Save". Recibe `initialValues` opcionales y devuelve los valores con `onSave`. Lo usa la `TaskFormScreen`.
- `TaskCard`: tarjeta de una tarea en la lista, con un checkbox, el título, la categoría y la descripción. Recibe `completed`, `onToggle` y `onPress` por props: el checkbox cambia el estado (si está completada, se ve el check naranja y el título atenuado) y el resto de la tarjeta abre el detalle.
- `TaskFilterPicker`: set de botones (`TouchableOpacity`) para elegir el filtro de la lista: All, Pending o Completed. El seleccionado se ve relleno de naranja.
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
- `taskFilters.ts`: filtros de la lista (All, Pending y Completed) y el filtro por defecto

El header y la barra de pestañas usan los mismos colores, a través del tema del `NavigationContainer` y de `headerOptions.ts`.

## Tecnologías

- Expo SDK 58
- React Native
- TypeScript
- Redux Toolkit (`@reduxjs/toolkit`)
- React Redux (`react-redux`)
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
- `store/`: el store de Redux, el slice de tareas y los hooks tipados
- `constants/`: constantes de diseño (colores, espaciados, bordes y sombras), categorías y filtros de tareas
- `entities/`: tipos de las entidades de la app (`Task` y `TaskInput`)

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Task } from '@entities/task';
import { useAppSelector } from '@store/hooks';
```

Alias disponibles: `@assets`, `@components`, `@screens`, `@navigation`, `@store`, `@constants`, `@entities`.

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
