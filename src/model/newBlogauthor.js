const mongoose = require("mongoose");
const newBlogAuthor = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        title : {
            type: String,
            enum: ["Mr", "Mrs", "Miss"]
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);




module.exports = mongoose.model("NewUser", newBlogAuthor);