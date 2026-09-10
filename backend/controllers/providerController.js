const ProviderProfile = require("../models/ProviderProfile");

const getProfile = async (req, res) => {
  try {
    let profile = await ProviderProfile.findOne({
      userId: req.user.id,
    }).populate("userId", "name email");

    if (!profile) {
      profile = await ProviderProfile.create({
        userId: req.user.id,
      });

      profile = await ProviderProfile.findById(profile._id).populate(
        "userId",
        "name email"
      );
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      phone,
      serviceCategories,
      skills,
      experience,
      serviceLocation,
    } = req.body;

    let profile = await ProviderProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      profile = new ProviderProfile({
        userId: req.user.id,
      });
    }

    if (profile.applicationStatus === "approved") {
      return res.status(400).json({
        message: "Approved profile cannot be edited",
      });
    }

    if (phone !== undefined) profile.phone = phone;
    if (serviceCategories !== undefined)
      profile.serviceCategories = serviceCategories;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (serviceLocation !== undefined)
      profile.serviceLocation = serviceLocation;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    let profile = await ProviderProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      profile = new ProviderProfile({
        userId: req.user.id,
      });
    }

    if (profile.applicationStatus === "approved") {
      return res.status(400).json({
        message: "Approved profile cannot be edited",
      });
    }

    if (req.files?.profilePhoto) {
      profile.profilePhoto = req.files.profilePhoto[0].path;
    }

    if (req.files?.idProof) {
      profile.documents.idProof = req.files.idProof[0].path;
    }

    if (req.files?.addressProof) {
      profile.documents.addressProof =
        req.files.addressProof[0].path;
    }

    await profile.save();

    res.status(200).json({
      message: "Documents uploaded successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

const submitApplication = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Please complete your profile first",
      });
    }

    if (!profile.serviceCategories?.length) {
      return res.status(400).json({
        message: "Please add at least one service category",
      });
    }

    if (!profile.skills?.length) {
      return res.status(400).json({
        message: "Please add at least one skill",
      });
    }

    if (!profile.serviceLocation?.city) {
      return res.status(400).json({
        message: "Please add your service location",
      });
    }

    profile.applicationStatus = "pending";
    profile.rejectionRemarks = "";

    await profile.save();

    res.status(200).json({
      message: "Application submitted successfully",
      status: profile.applicationStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

const getApplicationStatus = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({
      userId: req.user.id,
    }).select("applicationStatus rejectionRemarks");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get application status",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadDocuments,
  submitApplication,
  getApplicationStatus,
};