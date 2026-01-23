import express from "express"
import BlogsCtrl from "./blogs.controller.js"
import upload from "../../middleware/Upload.middleware.js"

const router = express.Router()

router.route("/").get(BlogsCtrl.apiGetBlogs)
router.route("/:id").get(BlogsCtrl.apiGetBlogByID)
router.route("/:id").put(BlogsCtrl.apiUpdateBlog)
router.route("/:id").delete(BlogsCtrl.apiDeleteBlog)
router.route("/").post(upload.single('image'), BlogsCtrl.apiAddBlog)

export default router
