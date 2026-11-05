# TaskFlow

App mobile de gestión de tareas desarrollada con **React Native** y **Expo** (Managed Workflow), como proyecto final del curso de Desarrollo de Aplicaciones de Coderhouse.

Cada usuario inicia sesión con su email (Firebase Authentication) y sus tareas se guardan en la nube (Cloud Firestore), separadas de las de los demás usuarios.

Los textos de la app están en inglés. Donde el enunciado pedía un texto puntual en español, se usó su equivalente en inglés:

- Estado vacío de la lista (Checkpoint 4): "You have no pending tasks!" / "Start by creating one with the + Add button above." en lugar de "¡No tienes tareas pendientes! Empieza por crear una arriba."
- `Alert` al guardar una tarea (Checkpoint 3): "Success" / "Task saved locally" en lugar de "Éxito" / "Tarea capturada localmente". Desde el Checkpoint 7 dice "Task saved", porque la tarea ya no queda solo en el teléfono: se guarda en Firestore.

## Checkpoints

- **Checkpoint 1: Estructura base.** Proyecto inicializado, arquitectura de carpetas y pantalla de bienvenida.
- **Checkpoint 2: Pantallas iniciales y tarjeta de perfil.** Pantallas `HomeScreen` y `ProfileScreen`, componente reutilizable `ProfileCard` y sistema de estilos centralizado.
- **Checkpoint 3: Formulario de creación de tareas.** Botón "+ Add" en la `HomeScreen` que abre un modal con un formulario controlado, validaciones y feedback visual. Las tareas guardadas se muestran en la lista de la Home.
- **Checkpoint 4: Lista de tareas con detalle.** Estado vacío con el componente `EmptyState`, y pantalla `TaskDetailScreen` que se abre al tocar una tarea, con botones para volver a la lista y para borrar la tarea.
- **Checkpoint 5: Navegación.** React Navigation con un `Tab.Navigator` (Home y Profile) y un `Stack.Navigator` anidado en Home para el flujo de tareas (`TaskList`, `TaskDetail` y `TaskForm`). La tarea seleccionada viaja por `route.params` y el formulario vuelve a la lista solo al guardar.
- **Checkpoint 6: Estado global con Redux Toolkit.** Las tareas y el filtro viven en un store de Redux (`createSlice` y `configureStore`). La lista, el detalle y el formulario leen y modifican el mismo store, así que un cambio hecho en una pantalla se ve en todas. Se pueden crear, editar, completar y borrar tareas, y filtrarlas por estado.
- **Checkpoint 7: Autenticación y persistencia con Firebase.** Registro, inicio y cierre de sesión con Firebase Authentication, con la sesión guardada en el teléfono y rutas protegidas: sin sesión solo se ven Login y Register. Las tareas se guardan en la colección `tasks` de Firestore, vinculadas al `uid` de cada usuario, y la lista se actualiza en tiempo real.

## Firebase

La app usa dos servicios del proyecto de Firebase `taskflow-1dcc6`:

- **Authentication**, con el proveedor Email/Password, para las cuentas de usuario. El nombre se guarda como `displayName` del usuario.
- **Cloud Firestore**, con la colección `tasks`, para las tareas.

Toda la comunicación con Firebase vive en `src/services/`:

- `firebaseConfig.ts`: inicializa Firebase y exporta `auth` y `db`.
- `authService.ts`: crear la cuenta, iniciar y cerrar sesión, escuchar los cambios de sesión y traducir los errores de Authentication.
- `tasksService.ts`: el listener de tareas, las escrituras en Firestore y la traducción de sus errores.

### Configuración

- **La configuración está en el repo.** El objeto `firebaseConfig` de `firebaseConfig.ts` no es un secreto: identifica al proyecto ante Firebase, y es el mismo que viaja dentro de cualquier app web publicada. Lo que protege los datos son el login y las reglas de seguridad de Firestore. Por eso quien clone el repo puede correr la app tal cual y probarla creando su propia cuenta.
- **Sesión persistente.** `auth` se crea con `initializeAuth` y `getReactNativePersistence(AsyncStorage)`, así la sesión queda guardada en el teléfono y sobrevive a cerrar la app. Con `getAuth` a secas, en React Native la sesión se perdería al reiniciarla.
- **Tipos de `getReactNativePersistence`.** `src/types/firebase-auth.d.ts` declara su tipo. `@firebase/auth` exporta esa función en su versión para React Native, pero en su `package.json` la condición `types` va antes que `react-native`, así que TypeScript toma los tipos de la versión web, donde no existe. En la ejecución no hay problema, porque Metro sí usa la versión de React Native.
- Si `firebaseConfig.ts` se vuelve a ejecutar durante el desarrollo (por ejemplo, con un Fast Refresh), reutiliza la app y el `auth` que ya existen en lugar de inicializarlos dos veces.

### Modelo de datos

Colección `tasks`, con un documento por tarea. El ID de cada documento lo genera Firestore.

| Campo         | Tipo                              | Descripción                                                                                                                                                         |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `userId`      | string                            | `uid` del usuario dueño de la tarea                                                                                                                                 |
| `title`       | string                            | Título                                                                                                                                                              |
| `description` | string                            | Descripción                                                                                                                                                         |
| `category`    | `'personal' \| 'work' \| 'study'` | Categoría                                                                                                                                                           |
| `completed`   | boolean                           | Si la tarea está completada                                                                                                                                         |
| `createdAt`   | string (ISO)                      | Fecha de creación. Es un string porque Redux necesita valores serializables (un `Date` o un `Timestamp` de Firestore no lo son) y porque así ordena bien como texto |

### Reglas de seguridad

Las reglas están en `firestore.rules`, que es una copia de las publicadas en la consola de Firebase:

- **Leer y borrar:** solo si el `userId` de la tarea es el `uid` del usuario logueado.
- **Crear:** solo con el propio `userId`, y con un formato válido: exactamente los seis campos de la tabla, título no vacío, categoría válida, `completed` booleano y `createdAt` string.
- **Editar:** solo tareas propias, sin cambiar el `userId`, y con el mismo formato válido.

La app además pide solo las tareas propias (`where('userId', '==', uid)`), pero lo que garantiza la separación entre usuarios son las reglas: aunque alguien modificara la app, Firestore rechazaría leer o escribir tareas ajenas. Las dos cosas van juntas, porque Firestore solo acepta una consulta si todos los documentos que podría devolver cumplen las reglas, así que una consulta sin el filtro por `userId` sería rechazada.

### Usar otro proyecto de Firebase (opcional)

1. Crear un proyecto en la [consola de Firebase](https://console.firebase.google.com) y registrar una app web.
2. En **Authentication**, habilitar el proveedor **Correo electrónico/contraseña**.
3. Crear la base de **Firestore** en modo producción.
4. Publicar el contenido de `firestore.rules` en la pestaña **Reglas** de Firestore.
5. Reemplazar el objeto `firebaseConfig` en `src/services/firebaseConfig.ts` por el de la app web nueva.

## Autenticación

### Estado (`authSlice`)

```ts
type AuthState = {
	user: AuthUser | null;
	status: 'checking' | 'authenticated' | 'unauthenticated';
	isSubmitting: boolean;
	error: string | null;
};
```

- `user` es `{ uid, email, displayName }`. El `User` de Firebase no es serializable, así que el slice guarda solo esos campos.
- `status` arranca en `'checking'` hasta que Firebase informa si hay una sesión guardada. Cumple el papel del `isLoading` que sugiere la consigna.
- `isSubmitting` y `error` son el estado de carga y el mensaje de error del registro, el inicio y el cierre de sesión.
- **No se guarda el token.** El SDK de Firebase lo administra, lo renueva solo (vence cada hora) y lo adjunta en cada pedido a Firestore. Una copia en Redux quedaría desactualizada. Está explicado en un comentario en `authSlice.ts`.

### Acciones

| Acción             | Payload                     | Qué hace                                              | Dónde se despacha                             |
| ------------------ | --------------------------- | ----------------------------------------------------- | --------------------------------------------- |
| `createAccount`    | `{ name, email, password }` | Crea la cuenta y guarda el nombre con `updateProfile` | "Create account" en `RegisterScreen`          |
| `signIn`           | `{ email, password }`       | Inicia sesión                                         | "Sign in" en `LoginScreen`                    |
| `signOut`          | —                           | Cierra la sesión                                      | "Sign out" en `ProfileScreen`                 |
| `authStateChanged` | `AuthUser \| null`          | Actualiza `user` y `status`                           | El listener de sesión en `AppNavigator`       |
| `clearAuthError`   | —                           | Borra el mensaje de error                             | Al escribir en un campo o cambiar de pantalla |

`createAccount`, `signIn` y `signOut` son `createAsyncThunk` que llaman a `authService`. Si Firebase devuelve un error, el thunk lo rechaza con un mensaje ya traducido.

### Sesión y rutas protegidas

`AppNavigator` se suscribe a `onAuthStateChanged` al montarse y despacha `authStateChanged` con cada cambio. Según `status`, muestra:

```
checking         →  FullScreenLoader
unauthenticated  →  AuthStackNavigator:  Login → Register
authenticated    →  MainTabNavigator:    Home (stack de tareas) y Profile
```

- **Al abrir la app con una sesión guardada**, Firebase la recupera y la app entra directo al Home. La pantalla de carga evita que aparezca el login un instante antes.
- **Al registrarse**, Firebase inicia sesión con la cuenta nueva, `onAuthStateChanged` avisa y la app pasa sola al flujo privado.
- **Al cerrar sesión**, vuelve al login y el slice de tareas vuelve a su estado inicial.
- Sin sesión, las pantallas privadas no existen en el árbol de navegación, así que no hay forma de llegar a ellas.

### Mensajes de error

`getAuthErrorMessage`, en `authService.ts`, traduce los códigos de error de Firebase a mensajes claros, que Login y Register muestran dentro de la pantalla con el componente `ErrorMessage`:

| Código de Firebase                    | Mensaje                                                        |
| ------------------------------------- | -------------------------------------------------------------- |
| `auth/invalid-credential` y similares | "Incorrect email or password."                                 |
| `auth/email-already-in-use`           | "There is already an account with this email."                 |
| `auth/weak-password`                  | "The password must have at least 6 characters."                |
| `auth/invalid-email`                  | "The email address is not valid."                              |
| `auth/too-many-requests`              | "Too many attempts. Wait a moment and try again."              |
| `auth/network-request-failed`         | "No internet connection. Check your connection and try again." |
| Cualquier otro                        | "Something went wrong. Please try again."                      |

Firebase devuelve `auth/invalid-credential` tanto para una contraseña incorrecta como para un email sin cuenta, para no revelar qué emails están registrados. Por eso los dos casos muestran el mismo mensaje. El error se borra apenas el usuario vuelve a escribir.

## Estado global (Redux)

El estado de la app vive en un store de Redux Toolkit. Toda la lógica de estado está en `src/store/`:

- `store.ts`: crea el store con `configureStore`, con los slices `auth` y `tasks`, y exporta los tipos `RootState` y `AppDispatch`.
- `authSlice.ts`: la sesión (ver [Autenticación](#autenticación)).
- `taskSlice.ts`: las tareas y el filtro, con sus acciones y selectores.
- `createAppAsyncThunk.ts`: `createAsyncThunk` con los tipos del store ya aplicados.
- `hooks.ts`: `useAppSelector` y `useAppDispatch`, las versiones tipadas de `useSelector` y `useDispatch`.

`App.tsx` envuelve toda la app con `<Provider store={store}>`, así todas las pantallas tienen acceso al store.

### Estado de las tareas

```ts
type TasksState = {
	items: Task[];
	filter: 'all' | 'pending' | 'completed';
	status: 'idle' | 'loading' | 'ready' | 'error';
	error: string | null;
};
```

- `items` son las tareas del usuario logueado, la más nueva primero. Las carga el listener de Firestore.
- `filter` es el filtro de la lista. Arranca en `'all'`.
- `status` y `error` indican si las tareas se están cargando, si ya llegaron o si no se pudieron leer.
- Al cerrar sesión, el slice vuelve a su estado inicial.

### Acciones de las tareas

Las que escriben en Firestore son `createAsyncThunk`:

| Acción             | Payload                            | Qué hace en Firestore                                                                        | Dónde se despacha                          |
| ------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `addTask`          | `{ title, description, category }` | `addDoc` en `tasks`, con el `uid` del usuario logueado, `completed: false` y la fecha actual | "Save" en `TaskFormScreen`, al crear       |
| `updateTask`       | `{ id, changes }`                  | `updateDoc` del título, la descripción y la categoría                                        | "Save" en `TaskFormScreen`, al editar      |
| `toggleTaskStatus` | `id`                               | `updateDoc` de `completed`                                                                   | Checkbox de `TaskCard` y botón del detalle |
| `deleteTask`       | `id`                               | `deleteDoc`                                                                                  | "Delete task" en el detalle                |

Las que solo cambian el store:

| Acción            | Payload                             | Qué hace                                      | Quién la despacha                      |
| ----------------- | ----------------------------------- | --------------------------------------------- | -------------------------------------- |
| `tasksLoading`    | —                                   | Pasa `status` a `'loading'`                   | `useTasksSubscription`, al suscribirse |
| `tasksReceived`   | `Task[]`                            | Reemplaza `items`, ordenadas por fecha        | El listener, con cada cambio           |
| `tasksLoadFailed` | mensaje de error                    | Pasa `status` a `'error'` y guarda el mensaje | El listener, si falla                  |
| `setFilter`       | `'all' \| 'pending' \| 'completed'` | Cambia el filtro de la lista                  | `TaskFilterPicker` en la lista         |

### Selectores

- `selectTasks`: todas las tareas.
- `selectTaskById(state, taskId)`: una tarea por su ID. Lo usan el detalle y el formulario en modo edición.
- `selectTaskFilter`, `selectTasksStatus` y `selectTasksError`: el filtro y el estado de la carga.
- `selectFilteredTasks`: las tareas que corresponden al filtro. Está hecho con `createSelector`, que recuerda el último resultado: mientras las tareas y el filtro no cambien, devuelve el mismo array. Si devolviera un array nuevo en cada render, `useSelector` avisaría con un warning y la lista se volvería a renderizar sin motivo.
- `selectAuthUser`, `selectAuthStatus`, `selectIsAuthSubmitting` y `selectAuthError`: los de la sesión.

### Flujo de datos

```
ENVIAR
pantalla ─→ dispatch(addTask / updateTask / toggleTaskStatus / deleteTask)
         ─→ tasksService (addDoc / updateDoc / deleteDoc) ─→ Firestore

RECIBIR
Firestore ─→ onSnapshot (tasksService.subscribeToTasks) ─→ useTasksSubscription
          ─→ dispatch(tasksReceived(tareas)) ─→ store ─→ useAppSelector ─→ pantallas
```

Las pantallas no escriben en Redux: escriben en Firestore, y Redux se actualiza solo con lo que devuelve el listener. Así hay una única fuente de verdad: la pantalla no puede mostrar algo distinto de lo que hay en Firestore, y un cambio hecho desde otro lado (otro teléfono o la consola de Firebase) aparece solo. Como las pantallas leen del store, si marcás una tarea como completada en el detalle o la editás en el formulario, al volver la lista ya muestra el cambio. Y como el filtro también está en el store, se mantiene al cambiar de pestaña.

### Decisiones

- **Hooks tipados.** `useAppSelector = useSelector.withTypes<RootState>()` y `useAppDispatch = useDispatch.withTypes<AppDispatch>()` son `useSelector` y `useDispatch` con los tipos del store ya aplicados, así no hay que escribir `(state: RootState)` en cada uso. Es lo que recomienda la documentación de Redux Toolkit para TypeScript. Con el mismo criterio, `createAppAsyncThunk` les da a los thunks el tipo del estado (para leer el `uid` del usuario) y el del mensaje de error.
- **Listener en tiempo real.** La consigna permite leer las tareas al montar la pantalla o con un listener. Uso el listener (`onSnapshot`) porque refleja también los cambios hechos fuera de la app. Se activa en `MainTabNavigator`, o sea al entrar a la zona privada, y se cancela solo al cerrar sesión, cuando esa parte de la navegación se desmonta.
- **Las escrituras no esperan al servidor.** Al guardar, borrar o completar una tarea, la pantalla no espera la confirmación de Firestore para seguir. Firestore aplica el cambio en su caché local y el listener lo muestra al instante, incluso sin internet; cuando vuelve la conexión, lo sube. Si el servidor lo rechaza, Firestore deshace el cambio y la pantalla muestra un `Alert` con el error.
- **Límite del modo sin conexión.** En React Native, Firestore guarda los cambios pendientes en memoria. Si se cierra la app sin conexión, antes de que se suban, esos cambios se pierden.
- **El orden se aplica en la app.** Las tareas se ordenan por `createdAt` en `tasksReceived`. Ordenarlas en la consulta, junto con el filtro por `userId`, exigiría crear un índice compuesto en Firestore.
- **Lectura defensiva.** `tasksService` convierte cada documento en un `Task` con valores por defecto si falta un campo o tiene un tipo incorrecto (por ejemplo, si se editó a mano en la consola). Así un dato inválido no cierra la app.
- **`createdAt` es un string ISO.** Redux Toolkit avisa cuando hay valores no serializables en el estado (y React Navigation, cuando los hay en los parámetros), y un `Date` no se puede serializar. Por eso la fecha se guarda como string, y el detalle la convierte a `Date` solo para mostrarla.
- **Componentes puros.** `TaskCard`, `TaskFilterPicker`, `TaskForm` y `ProfileCard` no conocen Redux ni Firebase: reciben datos y callbacks por props. Las pantallas son las que leen del store y despachan acciones.
- **El detalle recibe solo el `taskId`.** Busca la tarea en el store, así que cualquier cambio se ve al instante. Al borrarla, el detalle no renderiza nada mientras se cierra, porque la tarea ya no existe en el store.
- **Los reducers "mutan" el estado.** `state.filter = action.payload` parece una mutación, pero Redux Toolkit usa Immer por detrás y genera un estado nuevo.

## Navegación

La navegación usa React Navigation 7. Toda la configuración vive en `src/navigation/`:

- `AppNavigator.tsx`: el `NavigationContainer`, con un tema armado con la paleta de la app, y el listener de sesión. Elige qué navegador mostrar según la sesión.
- `AuthStackNavigator.tsx`: el `Stack.Navigator` público, con Login y Register.
- `MainTabNavigator.tsx`: el `Tab.Navigator` privado, con Home y Profile. Activa el listener de tareas.
- `TasksStackNavigator.tsx`: el `Stack.Navigator` del flujo de tareas.
- `types.ts`: las rutas de cada navegador y sus parámetros.
- `headerOptions.ts`: el estilo del header que comparten las pestañas y el stack (fondo naranja y título blanco centrado).

### Estructura

```
App
└─ AppNavigator (según auth.status)
   ├─ checking         → FullScreenLoader
   ├─ unauthenticated  → Stack.Navigator (sin header)
   │                       ├─ Login       (ruta inicial)
   │                       └─ Register
   └─ authenticated    → Tab.Navigator
                           ├─ Home ──→ Stack.Navigator
                           │            ├─ TaskList     (ruta inicial)
                           │            ├─ TaskDetail   { taskId }
                           │            └─ TaskForm     { taskId? }
                           └─ Profile ─→ ProfileScreen
```

- **Navegación según la sesión:** cuando cambia `auth.status`, `AppNavigator` muestra el navegador que corresponde, y React Navigation pasa de uno a otro solo, sin llamar a `navigate`.
- **`Tab.Navigator` (zona privada):** las dos secciones de la app, al mismo nivel. Cada pestaña tiene un ícono de `Ionicons` (`@expo/vector-icons`), relleno cuando está activa. Las pestañas conservan su estado: si estás en el detalle de una tarea, vas a Profile y volvés, seguís en el detalle.
- **`Stack.Navigator` (dentro de Home):** el flujo de tareas. Cada pantalla se apila sobre la lista y "atrás" la saca, así que la lista vuelve a verse tal como estaba. El stack se encarga del header con el título de cada pantalla, del botón atrás de Android y del gesto de deslizar desde el borde en iOS.
- La pestaña Home oculta su propio header (`headerShown: false`) para que no se vean dos. El que se ve es el del stack, que cambia el título según la pantalla y muestra el botón atrás (`BackButton`).
- Títulos del header: "Home" (`TaskList`), "Task detail", "New task" o "Edit task" (`TaskForm`, según si recibe un `taskId`) y "Profile". Login y Register no tienen header.

### Flujo

| Acción                                                  | Llamada                                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| "Sign in" en Login                                      | `dispatch(signIn(...))`. Si sale bien, la app pasa sola a la zona privada              |
| "Create one" en Login                                   | `navigation.navigate('Register')`                                                      |
| "Create account" en Register                            | `dispatch(createAccount(...))`. Si sale bien, la app pasa sola a la zona privada       |
| "Sign in" en Register                                   | `navigation.goBack()`                                                                  |
| "Sign out" en Profile                                   | `dispatch(signOut())`. La app vuelve sola al login                                     |
| Tocar una tarea en la lista                             | `navigation.navigate('TaskDetail', { taskId })`                                        |
| "+ Add" en la lista                                     | `navigation.navigate('TaskForm')`                                                      |
| "Edit task" en el detalle                               | `navigation.navigate('TaskForm', { taskId })`                                          |
| "Save" al crear                                         | `dispatch(addTask(...))` y `navigation.navigate('TaskList', undefined, { pop: true })` |
| "Save" al editar                                        | `dispatch(updateTask(...))` y `navigation.goBack()`                                    |
| "Cancel" en el formulario                               | `navigation.goBack()`                                                                  |
| "Delete task" en el detalle                             | `dispatch(deleteTask(id))` y `navigation.goBack()`                                     |
| Botón atrás del header (`BackButton`)                   | `navigation.goBack()`                                                                  |
| Botón atrás de Android o deslizar desde el borde en iOS | Lo maneja el stack                                                                     |

Las pantallas usan los hooks `useNavigation` y `useRoute`, tipados con `AuthStackParamList` o `TasksStackParamList`.

### Decisiones

- **La navegación solo lleva IDs.** Desde el Checkpoint 6 las tareas viven en el store, así que la navegación solo pasa el `taskId` y cada pantalla busca la tarea en el store. En el Checkpoint 5, sin estado global, la tarea entera viajaba por parámetros, y la lista recibía de vuelta por `route.params` las tareas nuevas y las borradas.
- **`navigate` con `{ pop: true }`.** En React Navigation 7, `navigate('TaskList')` ya no vuelve a una pantalla que está más abajo en el stack: apila una nueva. Sin la opción `pop`, después de crear una tarea quedarían dos listas apiladas y el botón atrás volvería al formulario. Con `{ pop: true }`, vuelve a la `TaskList` que ya existe.
- **El formulario es una pantalla del stack, no un modal.** Tiene el header con "New task" o "Edit task" y el botón atrás, y la barra de pestañas sigue visible.
- **Botón atrás propio.** El stack usa `BackButton` en `headerLeft`, igual en iOS y Android. Desde iOS 26, el botón atrás nativo va dentro de una burbuja de vidrio (Liquid Glass) que agranda el header, y React Navigation no tiene una opción estable para sacarla. Con un `headerLeft` propio y `headerLeftBackgroundVisible: false`, el tamaño y el color los define la app. Lo que se pierde en iOS es el menú que aparece al mantener apretado el botón atrás. El gesto de deslizar para volver y el botón atrás de Android siguen funcionando porque los maneja el stack.

## Pantallas

Todas las pantallas están en `src/screens/` y cada una es una ruta de un navegador. Se visualizan correctamente en Expo Go.

### LoginScreen

Es la ruta inicial del flujo público. Pide email y contraseña.

- "Sign in" valida los campos y despacha `signIn`. Mientras espera, el botón dice "Signing in…" y queda deshabilitado.
- Si Firebase rechaza el inicio de sesión (por ejemplo, con una contraseña incorrecta), el error aparece dentro de la pantalla, en un `ErrorMessage`.
- "Create one" abre la `RegisterScreen`.

### RegisterScreen

Pide nombre, email, contraseña y confirmación de la contraseña.

- "Create account" valida los campos (incluido que las contraseñas coincidan) y despacha `createAccount`. Mientras espera, el botón dice "Creating account…".
- Si Firebase rechaza el registro (por ejemplo, con un email ya registrado), el error aparece dentro de la pantalla.
- Al crear la cuenta, la app pasa sola al Home.
- "Sign in" vuelve a la `LoginScreen`.

### TaskListScreen

Es la ruta inicial del stack de la pestaña Home, así que es lo primero que se ve al iniciar sesión. Muestra la `ProfileCard` del usuario logueado y la sección "My tasks", con el filtro y la lista de tareas.

- La lista es un `FlatList` que scrollea toda la pantalla: la `ProfileCard`, el título "My tasks", el botón "+ Add" y el filtro van en el `ListHeaderComponent`.
- Las tareas salen del store, ya filtradas, con `useAppSelector(selectFilteredTasks)`. El store las recibe de Firestore.
- Mientras las tareas se cargan por primera vez, se ve un indicador de carga. Si no se pueden leer, aparece un `ErrorMessage` debajo del filtro.
- El filtro (`TaskFilterPicker`) tiene tres opciones: All, Pending y Completed. Al tocar una se despacha `setFilter`.
- Cada tarjeta tiene un checkbox que despacha `toggleTaskStatus`. Tocar el resto de la tarjeta abre el detalle (`TaskDetailScreen`).
- Cuando no hay tareas para mostrar, el `ListEmptyComponent` muestra un `EmptyState` con un mensaje distinto según el filtro. Uso `ListEmptyComponent` en vez de un ternario sobre `tasks.length` porque la `ProfileCard`, el botón "+ Add" y el filtro están en el header de la lista: con un ternario desaparecerían junto con la lista y no habría forma de crear una tarea ni de cambiar el filtro.
- El botón "+ Add" abre la `TaskFormScreen`. Al guardar, la tarea aparece al principio de la lista.

### TaskDetailScreen

Recibe el `taskId` en `route.params` y busca la tarea en el store con `selectTaskById`. Es de solo lectura: muestra el título, la categoría, el estado (Pending o Completed), la descripción completa y la fecha de creación.

- "Edit task" abre la `TaskFormScreen` en modo edición.
- "Mark as completed" / "Mark as pending" despacha `toggleTaskStatus`. El cambio se ve al instante en el detalle y en la lista.
- "Delete task" pide confirmación con un `Alert`, despacha `deleteTask` y vuelve a la lista.
- Si Firestore rechaza el cambio, aparece un `Alert` con el error.
- Para volver a la lista se usa el botón atrás del header, el botón atrás de Android o el gesto de deslizar desde el borde en iOS.

### TaskFormScreen

Muestra el `TaskForm` dentro de una tarjeta. Sirve para crear y para editar, según si recibe un `taskId`:

- **Crear** (sin `taskId`): título "New task" y campos vacíos. "Save" despacha `addTask` y vuelve a la lista.
- **Editar** (con `taskId`): título "Edit task" y campos cargados con la tarea, que busca en el store. "Save" despacha `updateTask` y vuelve al detalle, que ya muestra los datos nuevos.
- En los dos casos, "Save" muestra el `Alert` "Success / Task saved", y "Cancel" vuelve sin guardar. Si Firestore rechaza la escritura, aparece otro `Alert` con el error.
- Usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado. Como `KeyboardAvoidingView` calcula su posición sin contar el header, le paso la altura del header en `keyboardVerticalOffset`, que se obtiene con `useHeaderHeight` de `@react-navigation/elements`.

### ProfileScreen

Es la pestaña Profile.

- Arriba, la `ProfileCard` del usuario logueado (nombre y email) y el botón "Sign out", que pide confirmación y despacha `signOut`.
- Debajo, bajo el título "Team", una lista de `ProfileCard` con un equipo ficticio, usando `FlatList`. Cada tarjeta recibe datos distintos, lo que demuestra que el componente es reutilizable.

## Formularios

### Formulario de tareas

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
  2. Muestra el `Alert` "Success / Task saved".
- **No se limpia al guardar.** El formulario es una pantalla que se cierra al guardar, así que la próxima vez que se abre arranca de cero (o con los datos de la tarea, al editar). Si se limpiara, durante la animación de cierre se verían los campos vacíos.
- **UX mobile:**
  - El título usa `autoCapitalize="sentences"` y `returnKeyType="next"`, que pasa el foco a la descripción.
  - La descripción es multilínea.
  - La pantalla usa `KeyboardAvoidingView` para que el formulario quede por encima del teclado.

### Formularios de acceso

Login y Register usan el hook `useAuthForm`, que maneja los valores y los errores de cada campo, con el mismo comportamiento que el formulario de tareas: valida al salir del campo y al enviar, y el error se borra al escribir.

- **Validaciones antes de llamar a Firebase:**
  - Nombre: obligatorio.
  - Email: obligatorio y con formato de email.
  - Contraseña: obligatoria, mínimo 6 caracteres (el mínimo de Firebase).
  - Confirmación: igual a la contraseña.
- **UX mobile:** el email usa el teclado de email, sin mayúsculas ni autocorrección; las contraseñas se ocultan; "next" pasa al campo siguiente y "done" envía el formulario. Los campos tienen `autoComplete` y `textContentType` para que el teléfono ofrezca guardar y completar las credenciales.

## Componentes

- `ProfileCard`: tarjeta de perfil reutilizable. Recibe `name`, `role` e `image` (opcional) por props, sin datos fijos adentro. `image` acepta una imagen local o remota (`{ uri: 'https://...' }`); sin imagen, muestra un avatar genérico.
- `Typography`: textos con los tamaños y colores del tema.
- `TaskForm`: formulario para crear y editar tareas, con los botones "Cancel" y "Save". Recibe `initialValues` opcionales y devuelve los valores con `onSave`. Lo usa la `TaskFormScreen`.
- `TaskCard`: tarjeta de una tarea en la lista, con un checkbox, el título, la categoría y la descripción. Recibe `completed`, `onToggle` y `onPress` por props: el checkbox cambia el estado (si está completada, se ve el check naranja y el título atenuado) y el resto de la tarjeta abre el detalle.
- `TaskFilterPicker`: set de botones (`TouchableOpacity`) para elegir el filtro de la lista: All, Pending o Completed. El seleccionado se ve relleno de naranja.
- `CategoryBadge`: etiqueta con el nombre de la categoría. La usan `TaskCard` y `TaskDetailScreen`.
- `EmptyState`: mensaje con ícono para cuando una lista está vacía. Recibe `icon`, `title` y `message` por props.
- `ErrorMessage`: recuadro rojo con un ícono para mostrar un error dentro de la pantalla. Lo usan Login, Register y la lista de tareas.
- `AuthLayout`: estructura común de Login y Register: el logo, "TaskFlow", un subtítulo y una tarjeta con el formulario, con el teclado y la zona segura resueltos.
- `FullScreenLoader`: pantalla de carga que se ve mientras Firebase recupera la sesión.
- `TextField`: `TextInput` con label, texto de ayuda y mensaje de error. Cambia el color del borde según el foco o el error, y acepta todas las props de `TextInput`.
- `CategoryPicker`: set de botones (`TouchableOpacity`) para elegir la categoría de la tarea.
- `Button`: botón hecho con `TouchableOpacity`, con variantes `primary`, `secondary` y `danger` (para acciones como borrar), tamaños `medium` y `small`, y estado deshabilitado.
- `BackButton`: botón atrás del header. Es un círculo con el color de fondo de las pantallas y el `chevron-back` de `Ionicons` en naranja, del mismo tamaño que el título del header (17). Lo usan todas las pantallas del stack menos la primera.

## Hooks

- `useAuthForm`: valores, errores y validaciones de los formularios de Login y Register.
- `useTasksSubscription`: abre el listener de Firestore de las tareas del usuario logueado y las despacha al store. Lo usa `MainTabNavigator`.
- `useTaskForm` (en `components/TaskForm/`): la lógica del formulario de tareas.

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
- Firebase JS SDK (`firebase`): Authentication y Cloud Firestore
- @react-native-async-storage/async-storage, para guardar la sesión
- Redux Toolkit (`@reduxjs/toolkit`)
- React Redux (`react-redux`)
- React Navigation 7 (`native`, `bottom-tabs`, `native-stack` y `elements`)
- @expo/vector-icons
- react-native-safe-area-context
- ESLint + Prettier

## Estructura del proyecto

El código vive en `src/`, organizado en:

- `components/`: componentes reutilizables de UI
- `screens/`: pantallas de la app (cada una es una ruta de un navegador)
- `navigation/`: navegadores, tipos de las rutas y estilo del header
- `store/`: el store de Redux, los slices de sesión y de tareas, y los hooks tipados
- `services/`: la configuración de Firebase y los servicios de autenticación y de tareas
- `hooks/`: hooks propios (`useAuthForm` y `useTasksSubscription`)
- `constants/`: constantes de diseño (colores, espaciados, bordes y sombras), categorías y filtros de tareas
- `entities/`: tipos de las entidades de la app (`Task`, `TaskInput` y `AuthUser`)
- `types/`: declaraciones de tipos para librerías externas

En la raíz del proyecto, `firestore.rules` tiene las reglas de seguridad de Firestore.

Cada carpeta tiene un alias de importación configurado en `tsconfig.json`:

```ts
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Task } from '@entities/task';
import { useAppSelector } from '@store/hooks';
import { auth } from '@services/firebaseConfig';
```

Alias disponibles: `@components`, `@screens`, `@navigation`, `@store`, `@services`, `@hooks`, `@constants`, `@entities`.

## Pruebas de los flujos

Los flujos de inicio de sesión y de guardado de tareas se probaron a mano en Expo Go (SDK 58), contra el proyecto de Firebase, con dos cuentas de prueba (usuario A y usuario B). Cada prueba se verificó en la app y, cuando corresponde, en la consola de Firebase (**Authentication → Usuarios** y **Firestore Database → Datos**).

### Registro e inicio de sesión

| Prueba                    | Pasos                                                               | Resultado esperado                                                         |
| ------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Registro                  | Crear la cuenta del usuario A desde Register                        | La app entra sola al Home y la cuenta aparece en Authentication → Usuarios |
| Validaciones del registro | Enviar con campos vacíos, un email inválido o contraseñas distintas | Cada campo muestra su error y no se llama a Firebase                       |
| Email ya registrado       | Registrarse otra vez con el email de A                              | "There is already an account with this email." dentro de la pantalla       |
| Contraseña incorrecta     | Cerrar sesión e iniciar sesión con la contraseña equivocada         | "Incorrect email or password." dentro de la pantalla, sin cerrarse la app  |
| Inicio de sesión          | Iniciar sesión con los datos correctos                              | Entra al Home y muestra las tareas de A                                    |
| Sesión persistente        | Cerrar la app por completo y volver a abrirla                       | Entra directo al Home, sin pasar por el login                              |
| Cierre de sesión          | "Sign out" en Profile                                               | Vuelve al login. Al reabrir la app, sigue en el login                      |
| Sin conexión              | Con el modo avión activado, intentar iniciar sesión                 | "No internet connection…" dentro de la pantalla                            |

### Guardado de tareas

| Prueba                 | Pasos                                                                                | Resultado esperado                                                           |
| ---------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Crear                  | Con el usuario A, crear una tarea                                                    | Aparece en la lista y en Firestore → `tasks`, con el `userId` de A           |
| Completar              | Marcarla como completada desde la lista o el detalle                                 | `completed` cambia a `true` en el documento                                  |
| Editar                 | Cambiar título y categoría desde "Edit task"                                         | El detalle, la lista y el documento muestran los datos nuevos                |
| Borrar                 | Borrar una tarea desde el detalle                                                    | Desaparece de la lista y de Firestore                                        |
| Persistencia           | Cerrar la app y volver a abrirla                                                     | Las tareas siguen ahí                                                        |
| Tiempo real            | Editar o borrar un documento desde la consola de Firebase                            | La app se actualiza sola                                                     |
| Separación por usuario | Iniciar sesión con el usuario B                                                      | B no ve las tareas de A, y sus tareas nuevas se guardan con el `userId` de B |
| Reglas de seguridad    | En la zona de pruebas de reglas de Firestore, leer una tarea de A autenticado como B | La lectura se rechaza                                                        |
| Sin conexión           | Con el modo avión activado, crear una tarea y después reconectar                     | Aparece al instante en la app, y en Firestore cuando vuelve la conexión      |
| Filtros                | Usar All, Pending y Completed con tareas de Firestore                                | Funcionan igual que antes, y el filtro se mantiene al cambiar de pestaña     |

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

5. Crear una cuenta desde la pantalla de registro. La app ya está conectada al proyecto de Firebase, así que no hace falta configurar nada más.

## Scripts útiles

```bash
npx expo lint     # Revisar el código con ESLint y Prettier
npx tsc --noEmit  # Verificar los tipos de TypeScript
```

## Autor

Franco Borghi
