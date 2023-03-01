const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

// @desc   Get Products
// @route  GET /api/products
// @access Private
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    res.status(200).json(products)
})

// @desc   Get A Product
// @route  GET /api/products/:id
// @access Private
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        res.status(400)
        throw new Error('Product not found')
    }

    res.status(200).json(product)
})

// @desc   Product Search
// @route  POST /api/products/search
// @access Private
const searchProduct = asyncHandler(async (req, res) => {
        console.log("searchProduct req.body: ", req.body)
        const searchResults = await Product.find({"description" : { $regex: req.body.text, $options: 'i'}})

        if (!searchResults) {
            console.log('No products found')
            res.status(400).json({error: "Product not found"})
            // throw new Error('Product not found')
        } else {
            console.log('product search results: ', searchResults)
                // res.status(200).json({message: "hello!"})
                res.status(200).json(searchResults)
        }
    })

// @desc   Create Product
// @route  POST /api/products
// @access Private
const createProduct = asyncHandler(async (req, res) => {
    if(!req.body.upc) {
        res.status(400)
        throw new Error('UPC is required')
    }
    console.log('REQ.BODY ', req.body)
    const product = await Product.create(req.body)
    res.status(200)
})

// @desc   Update Product
// @route  POST /api/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        res.status(400)
        throw new Error('Product not found')
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedProduct)
})

// @desc   Delete Product
// @route  DELETE /api/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        res.status(400)
        throw new Error('Product not found')
    }
    await product.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getProducts,
    getProduct,
    searchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}