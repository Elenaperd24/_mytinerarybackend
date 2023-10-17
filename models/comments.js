const mongoose = require('mongoose') //va a almacenar los datos

const commentsSchema = new mongoose.Schema({
    intinerary: { type: mongoose.Types.ObjectId,ref:"itinerary", require: true },
    user: { type: mongoose.Types.ObjectId,ref:"user", require: true },
    comments: { type: String, require: true },
    date: { type: String, require: true }
    
})
const Comments = mongoose.model("comments", commentsSchema)

module.exports = Comments;  