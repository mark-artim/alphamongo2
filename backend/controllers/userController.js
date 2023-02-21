const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { validate } = require('../models/userModel')

// @desc   REGISTER NEW USER
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, phone, password } = req.body

    if(!name || !email || !phone || !password) {
        res.status(400)
        throw new Error('Please enter all fields.')
    }
    //Check if user already exists
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create User
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc   AUTHENTICATE USER
// @route  POST /api/login
// @access Public
const loginUser = asyncHandler(async (req, res, next) => {

    console.log('*** Controller: login req *** ',req.body)
    // console.log('next: ', next(error)   )

    const {email, password} = req.body

    //Check for user email
    const user = await User.findOne({email})
    console.log('user after findOne: ',user)
    if(!user) return res.json({ success: false, error: {message: 'No User Found'}});
    // if(!user) { return res.status(400).send('Invalid user name or password.') }

    const validPassword = await bcrypt.compare(password, user.password)
    console.log('validPassword: ',validPassword)
    if(!validPassword) return res.json({ success: false, error: {message: 'No User Found'}});
    // if(!validPassword) return res.status(400).send('Invalid user name or password.')

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user._id)
        })
    } 
})


// @desc   GET USER DATA
// @route  POST /api/users/me
// @access Public
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email, phone } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        phone,
    })
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}