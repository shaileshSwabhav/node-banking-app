require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const { dbConnection } = require('./app.js')

const errorHandlerMiddleware = require("./middleware/error-handler")
const notFound = require("./middleware/not-found")

const router = require("./components")

app.use(cors({ origin: "*", credentials: true, exposedHeaders: ['Set-Cookie', 'X-Total-Count', 'Date', 'ETag'] }))
app.use(express.json())
app.use(cookieParser())

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

app.get('/', (req, res) => {
  res.send("Welcome to Banking App")
})

app.use("/api/v1/bank-app", router)

app.use(errorHandlerMiddleware)
app.use(notFound)

const startApp = async () => {
  try {
    const PORT = process.env.PORT || 4000
    await dbConnection()
    app.listen(PORT, console.log(`Server started at port ${PORT}`))
  } catch (error) {
    console.error(error);
  }
}

startApp()