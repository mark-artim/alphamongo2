const asyncHandler = require('express-async-handler')
const Customer = require('../models/customerModel')

// @desc   Get Customers
// @route  GET /api/customers
// @access Private
const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find()
    res.status(200).json(customers)
})

// @desc   Get A Customer
// @route  GET /api/customers/:id
// @access Private
const getCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if(!customer) {
        res.status(400)
        throw new Error('Customer not found')
    }

    res.status(200).json(customer)
})

// @desc   Customer Search
// @route  POST /api/customers/search
// @access Private
const searchCustomer = asyncHandler(async (req, res) => {
        console.log("searchCustomer req.body: ", req.body)
        const searchResults = await Customer.find({"name" : { $regex: req.body.text, $options: 'i'}})

        if (!searchResults) {
            console.log('No customers found')
            res.status(400).json({error: "Customer not found"})
            // throw new Error('Customer not found')
        } else {
            console.log('customer search results: ', searchResults)
                // res.status(200).json({message: "hello!"})
                res.status(200).json(searchResults)
        }
    })
    // REF: const customer = await Customer.findOne({name: new RegExp('^'+req.body.text+$, "i")}, function (err, docs)


// @desc   Create Customer
// @route  POST /api/customers
// @access Private
const createCustomer = asyncHandler(async (req, res) => {
    if(!req.body.name) {
        res.status(400)
        throw new Error('Name is required')
    }
    console.log('REQ.BODY ', req.body)
    const customer = await Customer.create(req.body)
    res.status(200)
})

// @desc   Update Customer
// @route  POST /api/customers/:id
// @access Private
const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if(!customer) {
        res.status(400)
        throw new Error('Customer not found')
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedCustomer)
})

// @desc   Delete Customer
// @route  DELETE /api/customers/:id
// @access Private
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if(!customer) {
        res.status(400)
        throw new Error('Customer not found')
    }
    await customer.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getCustomers,
    getCustomer,
    searchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}