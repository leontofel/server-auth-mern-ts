import express from "express";
import { PlaylistController } from "../controllers/playlistController";
import { hasAuthorization, TokenValidation } from "../middleware/auth";

const router = express.Router();

router
    .get("/playlists", TokenValidation, PlaylistController.listPlaylists)
    .post("/playlists/new", TokenValidation, PlaylistController.addPlaylist)
    .put("/playlists/edit/:id", TokenValidation, PlaylistController.updatePlaylist)
    .delete("/playlists/:id", TokenValidation, PlaylistController.deletePlaylist);

export default router;