# STEPS

##### Crea un archivo package.json 
```bash
npm init -y
```

## Instalación de Módulos Principales

##### Instalación de Express, framework de NodeJS
[https://expressjs.com/es/starter/installing.html]
```bash
npm i express
```
##### Instalación de Dotenv, para manejo de variables de entorno
[https://expressjs.com/es/starter/installing.html]
```bash
npm i dotenv
```
* Crea un archivo ".env" en la carpeta raíz del proyecto
##### Instalación de Firebase, para hacer consultas en el serivicio firestore de firebase
```bash
npm i firebase
```
##### Instalación de Morgan, permite ver por consola los http request que vallan llegando a nuestra aplicación 
```bash
npm i morgan
```

##### Instalación de Helmet, permite configurar cabezeras http para mejorar la seguridad de la api. 
```bash
npm i helmet
```

##### Instalación de Compression, permite comprimir resupestas y así ahorrar recursos en la transferencia de datos.
```bash
npm i compression 
```

##### Instalación de Cors, permite que se puedan solicitar recursos en una web desde un origen distinto.
```bash
npm i cors 
```

##### Instalación de Json Web Token, permite generar tokens de usuarios para consultar información de forma segura.
```bash
npm i jsonwebtoken
```

##### Instalación de Bcrypt, permite cifrar datos como las contraseñas.
```bash
npm i bcryptjs
```

##### Todos los Módulos principales
```bash
npm i express firebase morgan dotenv helmet compression cors jsonwebtoken bcryptjs ejs
```

## Instalación de Módulos de Desarrollo

##### Instalación de Nodemon, para que el servidor se reinicie automáticamente cada vez que modifiquemos el código
```bash
npm i nodemon -D
```

1. Reemplaza el comando "test" dentro del "scripts", del archivo "package.json":
Esto:
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
Por:
```json
"scripts": {
    "start:api": "NODE_ENV=production node -r dotenv/config index.js",
    "dev:api": "nodemon -r dotenv/config index.js --exec"
}
```

##### Todos los Módulos de Desarrollo
```bash
npm i nodemon -D
```
