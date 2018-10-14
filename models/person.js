const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})


/*
const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
  })

*/
personSchema.statics.formatPerson = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

//const Person = mongoose.model('Person', personSchema)
//module.exports = Person
module.exports = mongoose.model('Person', personSchema)