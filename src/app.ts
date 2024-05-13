import express, { Express } from "express"
import mongoose from "mongoose"
import cors from "cors"
import todoRoutes from "./routes"

const app: Express = express()

const PORT: string | number = process.env.PORT || 4001

app.use(cors());
app.options('*', cors());

app.use(express.json())
app.use(todoRoutes)


const uri: string = `mongodb://${process.env.MONGO_URI}:${process.env.MONGO_PORT}`

const mongoOptions: mongoose.ConnectOptions = { user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD, dbName: process.env.MONGO_DB }


mongoose
  .connect(uri, mongoOptions)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })