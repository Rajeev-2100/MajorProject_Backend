const Products = require('./model/product.model.jsx')
const { initializeDatabase } = require('./db/db.connect.js')
const express = require('express')
const fs = require('fs')

const app = express()
initializeDatabase()

app.use(express.json())

const jsonData = fs.readFileSync('./products.json', 'utf-8')
const ProductsData = JSON.parse(jsonData)

async function seedData() {
  try {
    for (const ProductData of ProductsData) {
      const newProduct = new Products(ProductData);
      await newProduct.save();
    }
    console.log("All products saved successfully");
  } catch (error) {
    console.log("Error seeding the data:", error.message);
  }
}

// seedData() 


const PORT = 3001
app.listen(PORT, () => {
    console.log('Server is running on this', PORT)
})