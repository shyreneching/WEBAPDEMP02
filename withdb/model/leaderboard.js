const mongoose = require("mongoose")

var Leaderboard = mongoose.model("leaderboard",{
    username: String,
    time: Number,
    date: Date
})

module.exports = {
    Leaderboard
}