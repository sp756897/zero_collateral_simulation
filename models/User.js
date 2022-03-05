const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema({
    username: {
        type: String,
        required: true
    },
    principal: {
        type: Number,
        required: false,
        default: 0
    },
    collateral: {
        type: Number,
        required: false,
        default: 0
    },
    rate: {
        type: Number,
        required: false,
        default: 8
    },
    interest: {
        type: Number,
        required: false,
        default: 0
    },
    previous_interest: {
        type: Number,
        required: false,
        default: 0
    },
    first_time: {
        type: Boolean,
        required: true,
        default: true

    },
    lent_amount: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = User = mongoose.model("users", Userschema);