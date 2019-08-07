const mongoose = require("mongoose")

var Leaderboard = mongoose.model("leaderboard",{
    username: String,
    time: Number,
    date: Number
})

module.exports = {
    Leaderboard
}