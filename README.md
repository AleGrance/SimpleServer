# Simple Nodejs API

Simple Nodejs fue creado usando NodeJS, Express, Babel, Sequelize y PostgreSQL

## Installation I

Clonar el repositorio y ejecutar `npm install` en la carpeta raiz del proyecto

```bash
npm i
```
## Installation II

- Instalar `PostgreSQL`
- Crear la base de datos a utilizar

## Config I

Crear el archivo `.ENV` en la raiz del proyecto y agregar los siguientes datos

```conf
DB_NAME=nombre_de_la_base
USER_NAME=user_de_la_base
USER_PWD=password_de_la_base
API_KEY=abc123
```

## Usage I

Incluye nodemon para el entorno de desarrollo. Ejecutar `npm run dev` mientras se esta desarrollando

```bash
npm run dev
```

### Header HTTP

Agregar el apikey en el header de cada solicitud. El `apikey` puede ser modificado si así lo desea

```bash
apikey: abc123
```

### Metodos HTTP

Obtener roles utilizando el metodo `GET`
```bash
http://localhost:3000/api/roles
```

Obtener users utilizando el metodo `GET`
```bash
http://localhost:3000/users
```

Obtener users paginado utilizando el metodo `POST`. Metodo especialmente utilizado para paginaciones
```bash
http://localhost:3000/usersFiltered
```

Agregar la siguiente estructura en el cuerpo `BODY` de la solicitud `POST` para la paginación.
```json
{
    "search": {
        "value": "ale"
    },
    "start": 0,
    "length": 10
}
```

## Usage II

Para ejecutar en produccion necesitas correr el comando `npm run build` para transpilar el codigo y `npm start` para ejecutar el proyecto en produccion

```bash
npm run build
npm start
```

## Author
Alejandro Grance
