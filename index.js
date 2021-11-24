require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { askForJson, authenticate } = require('./hooks');
const nodesRouter = require('./notes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(askForJson);
app.use(authenticate);
app.use("/notes", nodesRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});