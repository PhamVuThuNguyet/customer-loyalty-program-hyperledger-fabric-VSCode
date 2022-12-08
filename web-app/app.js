/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//create express web-app
const app = express();
const routes = require('./routes');

//get the libraries to call

//bootstrap application settings
app.use(express.static('./public'));
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

module.exports = app;
