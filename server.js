'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

let helmet = require('helmet')

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.xssFilter());

app.route('/:project/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
    });

app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

fccTestingRoutes(app);
apiRoutes(app);

app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('NÂO ENCONTRADO');
});

const listener = app.listen(process.env.PORT, function() {
    console.log('\n', 'Sua aplicação esta rodando na porta: http://localhost:' + listener.address().port, '\n');
    if (process.env.NODE_ENV) {
        console.log('EXECUTADNO TESTS ...');
        setTimeout(function() {
            try {
                runner.run();
            } catch (e) {
                console.log('TESTE NÂO VALIDAOD !');
                console.error(e);
            }
        }, 3500);
    }
});

module.exports = app; //for testing