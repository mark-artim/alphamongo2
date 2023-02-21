const express = require('express')
const router = express.Router()
const {getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer, searchCustomer} = require('../controllers/customerController')

router.route('/').get(getCustomers).post(createCustomer)
router.route('/search').post(searchCustomer)

router.route('/:id').get(getCustomer).post(updateCustomer).delete(deleteCustomer)

module.exports = router