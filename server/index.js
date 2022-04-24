const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('tazo'));

app.use('/api', require('./routes'));

app.listen(process.env.PORT);
