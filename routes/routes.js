const Router = require ('express').Router()
const datosController = require('../controller/datosControlles')
const commentsControllers = require('../controller/commentsControlles')
const passport = require('../config/passport')

const {obtenerDatos , obtenerItineraries, likeDisLike} = datosController //desestructuracion
const userController = require("../controller/userControlles.js")
const validator = require("../controller/validador")
const {nuevoUsuario, verifyEmail , accesUser, cerrarSesion, verifyToken} = userController
const {cargarComments, obtenerComments, deleteComments, editComments} = commentsControllers
Router.route('/datos')
.get(obtenerDatos)

Router.route('/infoitinerary/:city')
.get(obtenerItineraries)

Router.route("/signup")
.post(validator, nuevoUsuario)

Router.route("/verify/:uniqueString")
.get(verifyEmail)

Router.route("/signin")
.post(accesUser)

Router.route("/signout")
.post(cerrarSesion)

Router.route("/comments")
.post(cargarComments)

Router.route("/comments/:id")
.get(obtenerComments)
.delete(deleteComments)
.put(editComments)

Router.route("/signinToken")
.get(passport.authenticate("jwt",{session:false}),verifyToken)

Router.route("/likeDislike/:id")
.put(passport.authenticate("jwt",{session:false}),likeDisLike)

module.exports = Router