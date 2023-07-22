require("dotenv").config()
const express = require("express")
const app = express()
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const cookieParser = require("cookie-parser")
const cors = require("cors")

const errorHandlerMiddleware = require("./middleware/error-handler")
const notFound = require("./middleware/not-found")

const router = require("./components")

// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions1 = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

var corsOptions2 = {
  origin: true,
  credentials: true,
  exposedHeaders: ['Set-Cookie', 'X-Total-Count'],
}

app.use(cors(corsOptions2))

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 4000

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank app",
      version: "1.0.0",
      description: "Description for banking app"
    },
    servers: [{
      url: `http://localhost:${PORT}`
    }],
  },
  apis: ["./components/*/controller/*.js"]
}

const specs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.get('/', (req, res) => {
  console.log("/ route hit");
  res.send("Welcome to Banking App")
})

app.use("/api/v1/bank-app", router)

app.use(errorHandlerMiddleware)
app.use(notFound)

const startApp = async () => {
  try {
    // await redisClient.connect()
    // console.log("redis connected");
    app.listen(PORT, console.log(`Server started at port ${PORT}`))
  } catch (error) {
    console.error(error);
  }
}

startApp()