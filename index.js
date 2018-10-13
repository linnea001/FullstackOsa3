const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(bodyParser.json())

//app.use(morgan('tiny'))
morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.use(cors())
app.use(express.static('build'))



 app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons=> {
      response.json(persons.map(Person.formatPerson))
    })
    .catch(error => {
      console.log(error)
    })
})


app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.formatPerson(person))
      } else {
        reponse.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})



app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons=> {
      date = new Date()
      total = persons.length

      const text = '<p>Luettelossa '+ total + ' henkilöä</p> ' + date
      response.send(text)
    })
    .catch(error => {
      console.log(error)
    })
})


app.post('/api/persons', (request, response) => {
  const body = request.body
 if (body.name.length === 0 || body.number.length === 0) {
    return response.status(400).json({error: 'nimi ja/tai numero puuttuu'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })


  Person
  .find({name: body.name})
  .then(foundPerson => {
    if (foundPerson.length > 0) {
       return response.status(404).end()
    } 
  })
  .catch(error => {
    console.log('virhe', error)
  })

  person
    .save()
    .catch(error => {
      console.log('virhe', error)
    })
    .then(savedPerson => {
      response.json(Person.formatPerson(savedPerson))
    })
    .catch(error => {
      console.log('virhe', error)
    })
}) 


app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  //if (body.number.length === 0) {
  //  return response.status(400).json({error: 'numero puuttuu'})
 // }

  const person = {
    name: body.name,
    number: body.number,
    id: body.id
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(Person.formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


app.delete('/api/persons/:id', (request, response) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})