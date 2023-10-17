const { array } = require('joi');
const mongoose = require('mongoose') //va a almacenar los datos

const itinerarySchema = new mongoose.Schema ({   
      name:{type:String,require:true},
      nroItinerario:{type:Number,require:true},
      city:{type:String,require:true},
      duracion: {type:String,require:true},
      costo: {type:String,require:true},
      descripcion: {type:String,require:true},
      actividades: {type:Object,require:true},
      likes:{type:Array,require:true}
        
    })
const Itinerary = mongoose.model("itinerary", itinerarySchema)

module.exports = Itinerary;   