const userModel = require("../models/user.model");
const TrackModel = require("../models/track.model");

// GET /api/admin/users?page=&limit=&search=
const adminListUsersController = async (req, res) => {
  try {
    let { page = 1, limit = 20, search = "" } = req.query;

    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ email: regex }, { fullName: regex }];
    }

    const [users, totalItems] = await Promise.all([
      userModel
        .find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      userModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return res.status(200).json({
      msg: "Users fetched successfully",
      users,
      pagination: { page, limit, totalPages, totalItems },
    });
  } catch (error) {
    console.error("adminListUsersController error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// PATCH /api/admin/users/:id/role { role: 'admin'|'user' }
const adminUpdateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(role)) {
      return res.status(422).json({ msg: "role must be 'admin' or 'user'" });
    }

    const user = await userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "Role updated", user });
  } catch (error) {
    console.error("adminUpdateUserRoleController error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// DELETE /api/admin/users/:id
const adminDeleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.error("adminDeleteUserController error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// GET /api/admin/tracks?page=&limit=&search=&status=
const adminListTracksController = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      search = "",
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { primaryArtist: regex },
        { publicId: regex },
        { label: regex },
      ];
    }

    const allowedSortFields = ["createdAt", "title", "status", "publicId"];
    if (!allowedSortFields.includes(sortBy)) sortBy = "createdAt";
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [tracks, totalItems] = await Promise.all([
      TrackModel.find(filter)
        .populate("user", "email fullName role")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      TrackModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return res.status(200).json({
      msg: "Tracks fetched successfully",
      tracks,
      pagination: { page, limit, totalPages, totalItems },
    });
  } catch (error) {
    console.error("adminListTracksController error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  adminListUsersController,
  adminUpdateUserRoleController,
  adminDeleteUserController,
  adminListTracksController,
};
