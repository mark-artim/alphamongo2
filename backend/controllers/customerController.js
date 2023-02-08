const asyncHandler = require('express-async-handler')

// @desc   Get Customers
// @route  GET /api/customers
// @access Private
const getCustomers = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Get Customers'})
})

// @desc   Create Customer
// @route  POST /api/customers
// @access Private
const createCustomer = asyncHandler(async (req, res) => {
    if(!req.body.name) {
        res.status(400)
        throw new Error('Name is required')
    }

    res.status(200).json({message: 'Create Customer'})
})

// @desc   Update Customer
// @route  PUT /api/customers/:id
// @access Private
const updateCustomer = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Update Customer ${req.params.id}`})
})

// @desc   Delete Customer
// @route  DELETE /api/customers/:id
// @access Private
const deleteCustomer = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Delete Customer ${req.params.id}`})
})

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}