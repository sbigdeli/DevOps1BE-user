import express, { Express } from "express"
import mongoose from "mongoose"
import cors from "cors"
import todoRoutes from "./routes"
import dotenv from "dotenv";

dotenv.config();

const app: Express = express()

const PORT: string | number = process.env.PORT || 4001

app.use(cors());
app.options('*', cors());

app.use(express.json())
app.use(todoRoutes)

const uri: string = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`


mongoose
  .connect(uri)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })