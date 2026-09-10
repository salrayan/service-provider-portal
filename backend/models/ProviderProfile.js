const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    serviceCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      min: 0,
    },

    serviceLocation: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },

    documents: {
      idProof: {
        type: String,
        default: "",
      },
      addressProof: {
        type: String,
        default: "",
      },
    },

    applicationStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },

    rejectionRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProviderProfile",
  providerProfileSchema
);