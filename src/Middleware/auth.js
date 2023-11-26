const { response } = require("express");
const jwt = require("jsonwebtoken");
const newblog = require("../model/newblog");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "token is required" });
    }
    let decodedToken = jwt.verify(token, "BloggingProject-01");
    if (!decodedToken) {
      return res.status(401).send({ msg: "request denied" });
    }
    req["x-api-key"] = decodedToken;

    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const authorization = async function (req, res, next) {
  let authorId = req["x-api-key"].authorId;

  console.log(authorId);

  let authoridFromQuery = req.query.blogId;
  let blogId = req.params.blogId;
  console.log(blogId);
  console.log(authoridFromQuery);

  if (blogId) {
    let blog = await newblog.findById(blogId);
    if (!blog) {
      return res.status(404).send({ status: false, msg: "blog not found" });
    }
    if (blog.authorId != authorId) {
      return res.status(401).send({ status: false, msg: "unauthorised" });
    } else {
      next();
    }
  }

  if (authoridFromQuery) {
    let blog = await newblog.findById(authoridFromQuery);
    if (!blog) {
      return res.status(404).send({ status: false, msg: "blog not found" });
    }
    if (blog.authorId != authorId) {
      return res.status(401).send({ status: false, msg: "unauthorised" });
    } else {
      next();
    }
  }
};

module.exports.authentication = authentication;
module.exports.authorization = authorization;
