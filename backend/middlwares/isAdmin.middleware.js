// backend/src/middlwares/isAdmin.middleware.js

module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin access required" });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};
