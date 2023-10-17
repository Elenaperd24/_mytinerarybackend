const mongoose = require('mongoose') //va a almacenar los datos

const citiesSchema = new mongoose.Schema({
    name: { type: String, require: true },
    country: { type: String, required: true },
    continent: { type: String, require: true },
    flag: { type: String, require: true },
    population: { type: Number, require: true },
    starWeek: { type: String, require: true },
    languages: { type: String, require: true },
    descripcion: { type: Object, require: true },
    images: { type: Object, require: true },
    likeItinerary: { type: Array, require: true }

})
const City = mongoose.model("cities", citiesSchema)

module.exports = City;