import mongodb from "mongodb";
import ApiError from "../utils/ApiError.util.js";
const ObjectId = mongodb.ObjectId;

let blogs;

export default class BlogsDAO {
  static async injectDB(conn) {
    if (blogs) {
      return;
    }
    try {
      blogs = await conn.db(process.env.BLOGS_NS).collection("blogs");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in BlogsDAO: ${e}`,
      );
    }
  }

  static async getBlogs({ filters = null, page = 0, blogsPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("author" in filters) {
        query = { author: { $eq: filters["author"] } };
      }
    }

    let cursor;

    try {
      cursor = await blogs.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { blogsList: [], totalNumBlogs: 0 };
    }

    const displayCursor = cursor.limit(blogsPerPage).skip(blogsPerPage * page);

    try {
      const blogsList = await displayCursor.toArray();
      const totalNumBlogs = await blogs.countDocuments(query);

      return { blogsList, totalNumBlogs };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      );
      return { blogsList: [], totalNumBlogs: 0 };
    }
  }

  static async getBlogByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
      ];
      const aggregateResult = await blogs.aggregate(pipeline).toArray();
      return aggregateResult[0];
    } catch (e) {
      console.error(`Something went wrong in getBlogByID: ${e}`);
      throw new ApiError("Unable to get blog by ID", 500);
    }
  }

  static async addBlog(title, author, content, date, id, imageUrl = null, imageFileId = null) {
    try {
      const blogDoc = {
        title: title,
        author: author,
        content: content,
        date: date,
        authorId: id,
        imageUrl: imageUrl,
        imageFileId: imageFileId,
      };
      return await blogs.insertOne(blogDoc);
    } catch (e) {
      console.error(`Unable to add blog: ${e}`);
      throw new ApiError("Unable to add blog", 500);
    }
  }
  static async updateBlog(blogId, title, content) {
    try {
      const updateResponse = await blogs.updateOne(
        { _id: new ObjectId(blogId) },
        {
          $set: { title: title, content: content },
        },
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update blog: ${e}`);
      throw new ApiError("Unable to update blog", 500);
    }
  }

  static async deleteBlog(blogId) {
    try {
      const deleteResponse = await blogs.deleteOne({
        _id: new ObjectId(blogId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete blog: ${e}`);
      throw new ApiError("Unable to delete blog", 500);
    }
  }
}
