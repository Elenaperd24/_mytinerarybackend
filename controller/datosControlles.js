const { response } = require('express')
const Cities = require('../models/cities')
const Itinerary = require('../models/itinerary')
const User = require("../models/user")

const datosController = {
    obtenerDatos: async (req, resp) => {
        let cities
        let error = null
        try {
            cities = await Cities.find()
        } catch (err) {
            error = err
            console.log(error);
        }
        resp.json({
            response: error ? 'ERROR' : { cities },
            success: error ? false : true,
            error: error
        })
    },

    obtenerItineraries: async (req, resp) => {
        let itinerary;
        console.log(req.params);
        const city = req.params.city
        let error = null
        try {
            itinerary = await Itinerary.find({ city: city })
        } catch (err) {
            error = err
            console.log(error);
        }
        resp.json({
            response: error ? 'ERROR' : { itinerary },
            success: error ? false : true,
            error: error
        })
    },
    likeDisLike: async (req, resp) => {
        const id = req.params.id
        const user = req.user.id
        let itinerary
        let city
        try {
            itinerary = await Itinerary.findOne({ _id: id })
            let cityItinerary = itinerary.city
            console.log("ciudad de itinerario con like:"+ cityItinerary)
            city = await Cities.find({ name: cityItinerary })
            let idCity = city[0]._id.toString()
            console.log(idCity)

            if (itinerary.likes.includes(user)) {                
              Cities.findByIdAndUpdate({ _id: idCity }, { $pull: { likeItinerary: user } }, { new: true })
                Itinerary.findByIdAndUpdate({ _id: id }, { $pull: { likes: user } }, { new: true })
                    .then(response => {
                        resp.json({ success: true, response: response.likes })
                    })

                    .catch(error => console.log(error))
            }
            else {                
               Cities.findByIdAndUpdate({ _id: idCity }, { $push: { likeItinerary: user } }, { new: true })
                Itinerary.findByIdAndUpdate({ _id: id }, { $push: { likes: user } }, { new: true })
                    .then(response => {
                        resp.json({ success: true, response: response.likes })
                    })
                    .catch(error => console.log(error))
            }
        } catch (err) {
            error = err
            resp.json({ success: false, response: error })
        }
    }


}

module.exports = datosController
