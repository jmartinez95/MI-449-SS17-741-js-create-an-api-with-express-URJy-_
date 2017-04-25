var tasks = require('./tasks.js')
var express = require('express')
var app = express()
var port = process.env.PORT || 8080

var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my To do list API!'
  })
})

app.get('/todos', function (request, response) {
  response.json(tasks)
})

app.get('/todos/:id', function (request, response) {
  if (!tasks[request.params.id]) {
    response.status(404).end('sorry, no such task: ' + request.params.id)
    return
  }
  response.json(tasks[request.params.id])
})

app.post('/todos', function (request, response) {
  var id = request.body.name.trim().toLowerCase().split(' ').join('-')
  tasks[id] = {
    name: request.body.name.trim(),
    price: request.body.done.trim()
  }
  response.redirect('/todos/' + id)
})

app.delete('/todos/:id', function (request, response) {
  if (!tasks[request.params.id]) {
    response.status(404).end('sorry, no such task: ' + request.params.id)
    return
  }
  delete tasks[request.params.id]
  response.redirect('/todos')
})

app.put('/todos/:id', function (request, response) {
  if (!tasks[request.params.id]) {
    response.status(404).end('sorry, no such task: ' + request.params.id)
    return
  }
  var task = tasks[request.params.id]
  if (request.body.name !== undefined) {
    task.name = request.body.name.trim()
  }
  if (request.body.done !== undefined) {
    task.done = request.body.done.trim()
  }
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
