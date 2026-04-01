const router = require("express").Router();

const authMiddleware = require("../middlwares/auth.middleware");
const isAdmin = require("../middlwares/isAdmin.middleware");

const {
  adminListUsersController,
  adminUpdateUserRoleController,
  adminDeleteUserController,
  adminListTracksController,
} = require("../controllers/admin.controller");

const { updateTrackStatusController } = require("../controllers/track.controller");

// ✅ USERS
router.get("/users", authMiddleware, isAdmin, adminListUsersController);
router.patch("/users/:id/role", authMiddleware, isAdmin, adminUpdateUserRoleController);
router.delete("/users/:id", authMiddleware, isAdmin, adminDeleteUserController);

// ✅ TRACKS (approve/reject/live/hold)
router.get("/tracks", authMiddleware, isAdmin, adminListTracksController);
router.patch("/tracks/:id/status", authMiddleware, isAdmin, updateTrackStatusController);

module.exports = router;
