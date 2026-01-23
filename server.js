import express from "express"
import cors from "cors"
import errorHandler from "./middleware/GlobalErrorHandler.middleware.js"
import users from "./api/users/users.route.js"
import blogs from "./api/blog/blogs.route.js"
import ApiError from "./utils/ApiError.util.js"
import authMiddleware from "./middleware/AuthHandler.middleware.js"
const app = express()

app.use(cors())
app.use(express.json())
app.use(authMiddleware);


app.use("/api/v1/users", users)
app.use("/api/v1/blogs",  blogs);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);



export default app