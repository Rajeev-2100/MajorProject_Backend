const mongoose = require('mongoose')
require('dotenv').config()

const mongoUri = process.env.MONGO_URL

const initializeDatabase = async () => {
    await mongoose
    .connect(mongoUri)
    .then(() => {
        return console.log('Connecting to database')
    })
    .catch((error) => {
        return console.log('Failed to connect Database', error)
    })
}

module.exports = { initializeDatabase }