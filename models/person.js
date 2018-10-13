const mongoose = require('mongoose')

const url = 'mongodb://stackuser:sanat0n@ds161112.mlab.com:61112/fullstack-kurssi'
// const url = process.env.MONGODB_URI

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
    

const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)
//module.exports = Person