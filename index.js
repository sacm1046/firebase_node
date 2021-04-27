const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const config = require('./config');

//Routes imports
const ingredientRoutes = require('./routes/ingredient.route');
const recepyRoutes = require('./routes/recepy.route');

const app = express();

//configurations for render templates
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

const prefix = '/api';

app.use(prefix, ingredientRoutes);
app.use(prefix, recepyRoutes);
app.get('/', (req, res) => res.render('index', { author: 'Codeme' }))

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server on port ${config.port}`)
})