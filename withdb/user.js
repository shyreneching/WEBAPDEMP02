const mongoose = require("mongoose")

var Account = mongoose.model("account",{
    username: String,
    password: String
})

module.exports = {
    Account
}