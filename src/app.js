import express, { json } from 'express';
import http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import '@babel/polyfill';
import config from './config';

//Routes imports
import ingredientRoutes from './routes/ingredient.route';

const app = express();

//configurations for render templates
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(json());
app.use(helmet());
app.use(compression());
app.use(cors());

const prefix = '/api';

app.get('/', (req, res) => res.render('index', { author: 'Sebastián Contreras' }))
app.use(prefix, ingredientRoutes);

const server = http.createServer(app)
server.listen(config.port, () => {
    console.log(`Server on port ${config.port}`)
})