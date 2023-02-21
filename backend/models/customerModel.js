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
        address2: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        postalcode: {
            type: String,
            required: [true, 'Postal Code is required'],
        },
        markup: {
            type: Number,
            required: [true, 'Markup is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        stname: {
            type: String,
            required: [true, 'Name is required'],
        },
        staddress: {
            type: String,
            required: [true, 'Address is required'],
        },
        staddress2: {
            type: String,
            required: false,
        },
        stcity: {
            type: String,
            required: [true, 'Address is required'],
        },
        ststate: {
            type: String,
            required: [true, 'Address is required'],
        },
        stpostalcode: {
            type: String,
            required: [true, 'Address is required'],
        },
        stlat: {
            type: String,
            required: [true, 'Address is required'],
        },
        stlong: {
            type: String,
            required: [true, 'Address is required'],
        },
    },
    // cust_index.index({ name: 1, phone: 1 }, { unique: true }),
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Customer', customerSchema)