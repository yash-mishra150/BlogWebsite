import BlogsDAO from "../../DAO/blogs.dao.js";
import ApiError from "../../utils/ApiError.util.js";
import { verifyToken } from "../../utils/jwt.util.js";
import { uploadImage, deleteImage } from "../../utils/ImageUpload.util.js";

export default class BlogsController {
  static async apiGetBlogs(req, res, next) {
    try {
      const filters = {};
      if (req.query.title) {
        filters.title = req.query.title;
      } else if (req.query.author) {
        filters.author = req.query.author;
      }

      const page = req.query.page ? parseInt(req.query.page, 10) : 0;
      const blogsPerPage = req.query.size ? parseInt(req.query.size, 10) : 20;

      const { blogsList, totalNumBlogs } = await BlogsDAO.getBlogs({
        filters,
        page,
        blogsPerPage,
      });

      res.json({
        blogs: blogsList,
        page,
        filters,
        size: blogsPerPage,
        total_results: totalNumBlogs,
      });
    } catch (error) {
      next(new ApiError(
        500,
        error.message || error || "Internal Server Error",
      ));
    }
  }

  static async apiGetBlogByID(req, res, next) {
    try {
      const blogID = req.params.id || {};
      const blog = await BlogsDAO.getBlogByID(blogID);
      if (!blog) {
        return next(new ApiError(404, "Blog not found"));
      }
      res.json(blog);
    } catch (error) {
      next(new ApiError(
        500,
        error.message || error || "Internal Server Error",
      ));
    }
  }

  static async apiUpdateBlog(req, res, next) {
    try {
      const blogID = req.params.id;
      const blogContent = req.body.content;
      const blogTitle = req.body.title;

      const updateResponse = await BlogsDAO.updateBlog(
        blogID,
        blogTitle,
        blogContent,
      );

      res.json({ status: "success", modifiedCount: updateResponse.modifiedCount });
    } catch (error) {
      next(new ApiError(
        500,
        error.message || error || "Internal Server Error",
      ));
    }
  }

  static async apiAddBlog(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const payload = verifyToken(token);
      const blogTitle = req.body.title;
      const blogAuthor = payload.name;
      const blogAuthorId = payload.id;
      const blogContent = req.body.content;
      const blogDate = new Date();

      let imageUrl = null;
      let imageFileId = null;
      if (req.file) {
        const imageResult = await uploadImage(
          req.file.buffer,
          req.file.originalname,
          '/blogs'
        );
        imageUrl = imageResult.url;
        imageFileId = imageResult.fileId;
      }

      const addResponse = await BlogsDAO.addBlog(
        blogTitle,
        blogAuthor,
        blogContent,
        blogDate,
        blogAuthorId,
        imageUrl,
        imageFileId
      );

      res.json({ status: "success", id: addResponse.insertedId, imageUrl });
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error || "Internal Server Error",
      );
    }
  }

  static async apiDeleteBlog(req, res) {
    try {
      const blogID = req.params.id;

      const blog = await BlogsDAO.getBlogByID(blogID);
      if (!blog) {
        throw new ApiError(404, "Blog not found");
      }

      if (blog.imageFileId) {
        try {
          await deleteImage(blog.imageFileId);
        } catch (imageError) {

          throw new ApiError(500, "Failed to delete associated image");
        }
      }

      // Delete the blog from database
      const deleteResponse = await BlogsDAO.deleteBlog(blogID);
      
      res.status(200).json({
        status: "success",
        message: "Blog deleted successfully"
      });
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error || "Internal Server Error",
      )
    }
  }
}
