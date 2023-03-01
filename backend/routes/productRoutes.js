const express = require('express')
const router = express.Router()
const {getProducts, createProduct, updateProduct, deleteProduct, getProduct, searchProduct} = require('../controllers/productController')

router.route('/').get(getProducts).post(createProduct)
router.route('/search').post(searchProduct)

router.route('/:id').get(getProduct).post(updateProduct).delete(deleteProduct)

module.exports = router