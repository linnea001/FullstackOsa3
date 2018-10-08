const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

//app.use(morgan('tiny'))
morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const p = persons.find(p => p.id === id)
  if ( p ) {
    response.json(p)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const total = persons.length
  date = new Date()
  if ( total > 0 ) {
      const text = '<p>Luettelossa '+ total + ' henkilöä</p> ' + date
      response.send(text)
  } else {
      response.status(404).end()
  }
})

const generateId = () => {
  const newId =  Math.round(Math.random()*1000)
  console.log(newId)
  return newId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name.length === 0 || body.number.length === 0) {
    return response.status(400).json({error: 'nimi ja/tai numero puuttuu'})
  }

  const exists = persons.find(p => p.name === body.name)
  if (exists){
    return response.status(400).json({error: 'nimi on jo luettelossa'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})