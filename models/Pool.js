const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Poolschema = new Schema({
    user: {
        type: String,
        required: true
    },
    pool: {
        type: Number,
        required: false,
        default: 0
    },
    netProfit: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = Pool = mongoose.model("pool", Poolschema);