const mongoose = require('mongoose')

const customerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Customer', customerSchema)