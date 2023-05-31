import express from "express"; //여기서 라우터 기능도 가져다 쓰기 때문에
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
//get이랑 controller랑은 항상 같이 다니기 때문에 controller파일 연결도 해준거고
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/", logout);
rootRouter.get("/search", search);

export default rootRouter;
