const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        upc: {
            type: String,
            uppercase: true,
            required: [true, 'UPC is required!'],
        },
        catalognum: {
            type: String,
            uppercase: true,
            required: [true, 'Catalog Number is required'],
        },
        shortname: {
            type: String,
            uppercase: true,
            required: [true, 'Vendor Short Name is required'],
        },
        description: {
            type: String,
            uppercase: true,
            required: [true, 'Description is required'],
        },
        picurl: {
            type: String,
            required: false
        },
        seller: {
            type: String,
            uppercase: true,
            required: [true, 'Seller is required'],
        },
        brand: {
            type: String,
            uppercase: true,
            required: [true, 'Brand is required'],
        },
        ucc: {
            type: String,
            required: [true, 'Vendor UCC is required'],
        },
        price_list: {
            type: String,
            required: [true, 'List Price is required'],
        },
        price_cost: {
            type: String,
            required: [true, 'Cost is required'],
        },
    },
    // cust_index.index({ name: 1, phone: 1 }, { unique: true }),
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Product', productSchema)