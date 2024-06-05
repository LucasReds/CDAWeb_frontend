# CDAWeb_frontend

### Como correr la app

- `cd tank-wars`
- `npm run dev`

### Como agregar rutas

- En archivo `Routing.jsx` agregar un nuevo `<Route path={ruta}>`

### TESTEAR LA API:

- Ir a `API TEST` en la navbar.
- Correr el repo de backend en local (recordar iniciar postgresql).
- Elegir un endpoint a testear y llenar los datos.

### AUTH PROFILE

- El botón profile lleva a /protected/UserCheck, el cual es un protected scope, sin embargo, como ese botón solo aparece una vez que el usuario ya está loggeado la verificación del token ya es realizada y queda redundante pero aun así ocurre para propósitos de la entrega. Ahora, si el token esta autorizado mostrará una que esta autorizado pero en caso de borrar el token del local storage y recargar la página le mostrará que no esta autorizado.

### HASHED PASSWORDS

- Las contraseñas se enceuntran hasheadas, para testear se puede utilizar el username: "host", con password: "123", que es creado en el seed. Además se pueden crear usuarios sin problemas.
