const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {

    firstName: {
      type: String,
      index: true
    },
    lastName: {
      type: String,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      index: true
    },
    otp: {
      type: Number,
      index: true
    },
    expirationTime: {
      type: Date,
      index: true
    },
    isVerified: {
			type: Boolean,
			default: false,
			index: true
		},
    status: {
      type: Number,
      default: 2,
      enum: [1, 2, 3], //1=Active 2=InActive 3=Deleted
      index: true
    }
  },
  { collection: "user", timestamps: true }
)


schema.options.toJSON = {
  transform: function (doc, ret) {
    // Convert createdAt and updatedAt to ISO strings
    if (ret.createdAt instanceof Date) {
      ret.createdAt = ret.createdAt.toISOString();
    }
    if (ret.updatedAt instanceof Date) {
      ret.updatedAt = ret.updatedAt.toISOString();
    }
    return ret;
  },
};

module.exports = mongoose.model("user", schema)