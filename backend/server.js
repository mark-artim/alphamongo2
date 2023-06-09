console.log("I'm starting up the server!")
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
const path = require('path')

console.log('environment    ', process.env.NODE_ENV)
console.log('PORT    ', process.env.PORT)
console.log('MONGO_CONNECTION_STRING    ', process.env.MONGO_URI)
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/customers', require('./routes/customerRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// --------------- deployment ------------------
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend','build', 'index.html'));

    })
} else {
    app.get('/', (req,res) => {
        res.send('API is running...')
    })
}

app.use(errorHandler)

app.listen(port, () => console.log('Server started on port ',port))