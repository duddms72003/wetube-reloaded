import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  }) //express session이 알아서 브라우저를 위한 세션 id를 만든다. / 서버는 1초마다 나를 까먹는 사람 / 내 id 카드를 보고서야 아 맞당 기억났다고 함
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
//Uncaught (in promise) ReferenceError: SharedArrayBuffer is not defined 오류 해결 방법
//오류 원인 : SharedArrayBuffer는 cross-origin isolated된 페이지에서만 사용할 수 있습니다. 따라서 ffmpeg.wasm을 사용하려면 Cross-Origin-Embedder-Policy: require-corp 및 Cross-Origin-Opener-Policy: same-origin를 header에 설정해 자체 서버를 호스팅해야 합니다.

// app.use((req, res, next) => {
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   res.header("Cross-Origin-Opener-Policy", "same-origin");
//   next();
// });
//////////////////////////////////////
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
