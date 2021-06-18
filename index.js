const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const config = require('./config');
global.XMLHttpRequest = require("xhr2");

//Routes imports
const ingredientRoutes = require('./routes/ingredient.route');
const recepyRoutes = require('./routes/recepy.route');

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

const prefix = '/api';

app.use(prefix, ingredientRoutes);
app.use(prefix, recepyRoutes);
app.get('/', (req, res) => res.json({ author: 'Codeme' }));

app.listen(config.port, () => {
  console.log(`Server on port ${config.port}`);
});
