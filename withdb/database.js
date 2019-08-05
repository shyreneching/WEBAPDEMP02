const mongoose = require("mongoose")

var User = mongoose.model("user",{
    username: String,
    password: String
})

module.exports = {
    User 
}

var Leaderboard = mongoose.model("user",{
    username: String,
    time: Number,
    date: Date
})

module.exports = {
    Leaderboard
}