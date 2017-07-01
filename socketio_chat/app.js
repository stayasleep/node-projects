const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 1337;
const server = app.listen(PORT);
const io = requite("socket.io")(server);

//globals for now...could be database later on
let users =[];
let connection =[];