const ProviderProfile = require("../models/ProviderProfile");

const getProviders = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query = {};

    if (status) {
      query.applicationStatus = status;
    }

    const profiles = await ProviderProfile.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const filteredProfiles = profiles.filter((profile) => {
      if (!search) return true;

      const text = `${profile.userId?.name || ""} ${
        profile.userId?.email || ""
      } ${profile.serviceLocation?.city || ""}`;

      return text.toLowerCase().includes(search.toLowerCase());
    });

    const total = await ProviderProfile.countDocuments(query);

    res.status(200).json({
      providers: filteredProfiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get providers",
      error: error.message,
    });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await ProviderProfile.findById(
      req.params.id
    ).populate("userId", "name email");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get provider",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionRemarks } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    if (status === "rejected" && !rejectionRemarks) {
      return res.status(400).json({
        message: "Rejection remarks are required",
      });
    }

    const provider = await ProviderProfile.findById(
      req.params.id
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.applicationStatus = status;

    provider.rejectionRemarks =
      status === "rejected" ? rejectionRemarks : "";

    await provider.save();

    res.status(200).json({
      message: `Application ${status} successfully`,
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application",
      error: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const total = await ProviderProfile.countDocuments();

    const pending = await ProviderProfile.countDocuments({
      applicationStatus: "pending",
    });

    const approved = await ProviderProfile.countDocuments({
      applicationStatus: "approved",
    });

    const rejected = await ProviderProfile.countDocuments({
      applicationStatus: "rejected",
    });

    const draft = await ProviderProfile.countDocuments({
      applicationStatus: "draft",
    });

    res.status(200).json({
      total,
      pending,
      approved,
      rejected,
      draft,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getProviders,
  getProviderById,
  updateApplicationStatus,
  getDashboardStats,
};