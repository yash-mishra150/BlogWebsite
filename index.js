import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./DAO/users.dao.js"
import BlogsDAO from "./DAO/blogs.dao.js"


dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.DB_URL,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await UsersDAO.injectDB(client)
    await BlogsDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })