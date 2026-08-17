### Recoger los datos del AsyncStorage

Para almacenar las notas uso "AsyncStorage" que es un sistem de almacenamiento asincrono, no encriptado que guarda clave-valor.

El funcionamiento es el siguiente:

- Obtengo los datos (las notas existentes) en `Main.jsx`:

```jsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const cargarNotas = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("notas");

    const notasGuardadas = jsonValue != null ? JSON.parse(jsonValue) : [];
    setListaNotas(notasGuardadas);
  } catch (e) {
    alert("Error al cargar las notas");
  }
};
```

- Renderizo los datos al cargar la vista principal:

```jsx
useFocusEffect(
  useCallback(() => {
    cargarNotas();
  }, []),
);
```

- Para crear una nueva nota al pulsal el boton vuelvo a hacer uso de la API de AsyncStorage:

```jsx
const crearNota = async () => {
  try {
    const nuevaNota = {
      id: Date.now().toString(),
      title: "",
      text: "",
      date: Date.now(),
      lastUpdate: Date.now(),
    };

    const nuevasNotas = [...listaNotas, nuevaNota];

    await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));

    setListaNotas(nuevasNotas);

    router.push(`/${nuevaNota.id}`);
  } catch (e) {
    alert("Error al crear nota");
  }
};
```

Aquí tambié uso `router.push()` para moverme a otra pagina (editor de texto donde escribir la nota)

- Le paso al componente `Notas.jsx` la lista de notas que hemops obtenido como prop. Este se encarga de renderizar una `NotaMenu.jsx` por cada nota que se encuentra en el array obtenido.

```jsx
<Animated.View style={{ flex: 1, opacity }}>
  {listaNotas?.length === 0 ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Anadir />
      <Text style={{ color: "#717171" }}>Aún no tienes notas escritas.</Text>
    </View>
  ) : (
    <FlatList
      numColumns={2}
      data={listaNotas}
      keyExtractor={(nota) => String(nota.id)}
      renderItem={({ item }) => (
        <NotaMenu
          id={item.id}
          title={item.title}
          text={
            item.text.length > 100
              ? item.text.slice(0, 100).concat("...")
              : item.text
          }
          style={styles.nota}
        />
      )}
    />
  )}
</Animated.View>
```

- En `NotaMenu.jsx` los props que le hemos pasado desde `Notas.jsx` (id, title, text...) los usa para pasarlos a la vista individual de cada nota (`[id].jsx`), es decir, abrir el editor de texto con el contenido de su nota correspondiente

```jsx
...
    <Link
      href={{
        pathname: "/[id]",
        params: {
          id: String(props.id),
          title: props.title,
          text: props.text,
        },
      }}
      asChild
    >
...
```

## Lógica del editor

- En `NuevaNota.jsx` es donde se gestiona la lógica del editor:

  1.- Guardamos los "estados" de la información con `useState`

  ```bash
    const params = useLocalSearchParams();
    const id = props.id || params.id;

    const [titulo, setTitulo] = useState(props.title || params.title || "");
    const [texto, setTexto] = useState(props.text || params.text || "");
  ```

  2.- Los gestionamos mediante los `<TextInputs>` con el prop `onChangeText` que ejecuta la función `actualizarTitulo` o `actualizarTexto` respectivamente cada vez que detecta un cambio en su campo.

  - Función para actualizar:

  ```jsx
  const actualizarTitulo = async (nuevoTitulo) => {
    setTitulo(nuevoTitulo);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, title: nuevoTitulo };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };
  ```

  ```jsx
  ...

    <TextInput
        className="mb-5 font-medium text-4xl text-white"
        placeholder="Titulo"
        value={titulo}
        onChangeText={actualizarTitulo}
    />

    <TextInput
        multiline
        style={{
        textDecorationLine: subrayado ? "underline" : "none",
        fontSize: tamanoFuente,
        }}
        value={texto}
        onChangeText={actualizarTexto}
        className="text-white flex-1 h-['100%']"
        placeholder={
        (texto ?? "").length === 0
        ? "Comienza a escribir aquí..."
        : texto
        }
    ></TextInput>
    ....
  ```

  _(Para el cambio de tamaño y otros cambios en el texto se usa la misma lógica)_

### Modal de opcionas

En `NotaMenu.jsx` he hecho un modal (del propio React native) que despliega las opciones (Favoritos, eliminar...). Para hacerlo he encuelto todo el componente en `<> </>` y he construido el Modal mediante la etiqueta `<Modal>`.

El funcionamiento es el siguiente:

- Controlo si el modal está activo :

```jsx
const [mostrarMenu, setMostrarMenu] = useState(false);
```

- Tengo en cuenta la posición del botón que se ha pulsado:

```jsx
const [posicion, setPosicion] = useState({ top: 0, left: 0 });
```

- Mediante la funcion `abrirMenu` calculo la posición en la que se abrirá el modal y cambio el estado de `mostrarMenu` a true para que se muestre:

```jsx
const abrirMenu = (event) => {
  event.stopPropagation();

  const { pageX, pageY } = event.nativeEvent;
  const anchoMenu = 140;

  setPosicion({
    top: pageY + 10,
    left: Math.max(10, pageX - anchoMenu + 15),
  });
  setMostrarMenu(true);
};
```

 * La linea:
``` jsx
if (props.onNotaEliminada) props.onNotaEliminada();
```

se encarga de hacer la llamada al callback que hay en el `Main.jsx` para volver a obtener todas las notas y actualizar el menú princiapl donde se muestran.
