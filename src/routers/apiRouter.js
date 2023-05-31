import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
// fetch(`/api/videos/${videoId}/comment`, {
// apiRouter.delete("/comments/:id([0-9a-z]{24})/delete", deleteComment);
apiRouter.delete("/comments/:commentId([0-9a-f]{24})/delete", deleteComment);
// fetch(`/api/comments/${commentId}`, {

export default apiRouter;
