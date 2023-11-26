const newblog = require("../model/newblog");
const review = require("../model/reviewModel");

createReview = async (req, res) => {
  try {
    const userId = req?.params?.userId;
    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, msg: "user id is not valid" });
    const { blogId, message, rating } = req?.body;
    if (!message)
      return res
        .status(400)
        .send({ status: false, msg: "message is mandatory" });
    if (!rating)
      return res
        .status(400)
        .send({ status: false, msg: "message is mandatory" });

    if (!mongoose.isValidObjectId(blogId))
      return res
        .status(400)
        .send({ status: false, msg: "blogId is not valid" });
    const product = await newblog.findById(blogId);
    if (!product)
      return res.status(404).send({ status: false, msg: "blog is not found" });
    if (product.isDeleted)
      return res.status(400).send({ status: false, msg: "product is deleted" });

    const previousReview = await reviewSchema.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["userId", { $toObjectId: userId }] },
              { $eq: ["blogId", { $toObjectId: userId }] },
            ],
          },
        },
      },
    ]);
    if (!previousReview)
      res.status(400).send({ status: false, msg: "You already give review" });

    const data = await reviewSchema.create({
      userId,
      blogId,
      rating,
      message,
    });

    res.status(201).send({ status: true, msg: "Successfully give the review" });
  } catch (error) {
    return res.status(500).send({ status: true, msg: error.message });
  }
};

updateReview = async (req, res) => {
  try {
    const reviewId = req?.body?.reviewId;
    const userId = req?.params?.userId;

    const review = await reviewSchema.findById(reviewId);
    if (!review)
      return res.status(404).send({ status: false, msg: "Review not found" });

    if (review.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized to update this review" });
    }

    review.message = message || review.message;
    review.rating = rating || review.rating;
    await review.save();
    res.status(200).send({ status: true, msg: "Review updated successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

getReview = async (req, res) => {
  try {
    const blogId = req?.params?.blogId; // Assuming the blogId is part of the URL parameters

    if (!mongoose.isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Product id is not valid" });
    }

    const product = await productModel.findById(blogId);
    if (!product) {
      return res.status(404).send({ status: false, msg: "Product not found" });
    }

    const reviews = await reviewSchema.find({ blogId });

    res.status(200).send({ status: true, reviews });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

deleteReview = async (req, res) => {
  try {
    const reviewId = req?.body?.reviewId;
    const userId = req?.params?.userId;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Review id is not valid" });
    }

    const review = await reviewSchema.findById(reviewId);
    if (!review) {
      return res.status(404).send({ status: false, msg: "Review not found" });
    }

    // Check if the user is authorized to delete the review (assuming user ID is stored in the review document)
    if (review.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized to delete this review" });
    }

    await review.remove();

    res.status(200).send({ status: true, msg: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.export = { createReview, updateReview, getReview, deleteReview };
