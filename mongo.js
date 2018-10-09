const mongoose = require('mongoose')

// ilman salasanaa
const url = 'mongodb://stackuser:<salasana>@ds161112.mlab.com:61112/fullstack-kurssi'

mongoose.connect(url, {useNewUrlParser:true })

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})


if (process.argv.length <= 2 || process.argv.length >=5) {
    Person
    .find({})
    .then(result => {
        console.log('puhelinluettelo')
        result.forEach(person => {
        console.log(person.name, ' ', person.number,)
        })
        mongoose.connection.close()
    })
}
else {
    const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
    id: Math.round(Math.random()*1000)
    })

    person
    .save()
    .then(response => {
        console.log('lisätty henkilö ', person.name, ' numero ', person.number, ' luetteloon')
        mongoose.connection.close()
    })
}