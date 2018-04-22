const
    express = require('express'),
    path = require('path')

const
    app = express(),
    server = require('http').Server(app),
    telesign = require('telesignsdk')

app.use(express.static(path.join(__dirname, '..', '/client')))
require('./sockets')(server)

server.listen(8080)
