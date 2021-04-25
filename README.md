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
##### Instalación de Babel, permite usar código moderno de JS en nodeJS.
[https://babeljs.io/docs/en/usage]
```bash
npm i @babel/polyfill @babel/runtime
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

##### Instalación de Ejs, permite trabajar con templates de html de fácil y rápida ejecución.
[https://ejs.co/]
```bash
npm i ejs
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
npm i express firebase morgan @babel/polyfill @babel/runtime dotenv helmet compression cors ejs jsonwebtoken bcryptjs
```

## Instalación de Módulos de Desarrollo

##### Instalación de Babel, permite usar código moderno de JS en nodeJS
[https://babeljs.io/docs/en/usage]
```bash
npm i @babel/core @babel/cli @babel/preset-env @babel/node @babel/plugin-transform-runtime -D 
```
1. Crea archivo ".babelrc" en la carpeta raíz del proyecto
2. Agrega el siguiente contenido:
```json
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        ["@babel/transform-runtime"]
    ]
}
```
3. Reemplaza el comando "test" dentro del "scripts", del archivo "package.json":
Esto:
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
Por:
```json
"scripts": {
    //Utiliza babel para convertir el código de desarrollo a codigo de producción.
    "build": "babel src --out-dir dist",
    "start": "node -r dotenv/config dist/index.js"
}
```
##### Instalación de Nodemon, para que el servidor se reinicie automáticamente cada vez que modifiquemos el código
```bash
npm i nodemon -D
```
* Agrega el siguiente script dentro de "scripts" del archivo "package.json"
```json
"scripts": {
    "dev": "nodemon -r dotenv/config src/index.js --exec babel-node",
  }
```
##### Todos los Módulos de Desarrollo
```bash
npm i @babel/core @babel/cli @babel/preset-env @babel/node nodemon @babel/plugin-transform-runtime -D
```
