//메모파일임

import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
//npm i morgan 설치해서 사용하면 페이지 404인지 활성화 중인지 터미널로 확인 가능/브라우저 키고 안봐도됨!
//morgan 도 미들웨어임(설치해서 쓰는 미들웨어)

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed, you may continue");
  next(); //얘가 있어서 미들웨어라고 불리는거
};

//res.send를 사용하는건 미들웨어가 아님 next()다음으로 넘어간다고 호출해주는게 미들웨어임
const handleHome = (req, res) => {
  return res.send("나는야 응답하는 서버라네");
  //2.그리고 서버는 응답하지 "나는야 응답하는 서버라네" 라고!
};

// app.use = global middleware를 만들 수 있게 해주는 함수
// (global middleware란? 어떤 url을 들어가도 사용하게 되는걸 의미함 / 모든 route에 적용가능)
// use가 없으면 request(get)요청하는 페이지마다 미들웨어를 넣어줘야하는데
// use가 있어서 그 안에 미들웨어들을 한 번에 몰아두고
// 필요한 route만 만들어서 request(get) 요청하면 됨
app.use(logger, privateMiddleware);
app.get("/", handleHome);
//1.클라이언트(브라우저)는 서버에게 페이지를 request 하는거야.

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);

// ===================================================================================================

// import express from "express";

// const PORT = 4000;
// const app = express();

// const urlLogger = (req, res, next) => {
//   console.log(`Path: ${req.path}`);

//   next();
// };

// const timeLogger = (req, res, next) => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();

//   console.log(`Time: ${year}-${month}-${day}`);

//   next();
// };

// const securityLogger = (req, res, next) => {
//   if (req.protocal === "https") {
//     console.log("secure");
//   } else {
//     console.log("insecure");
//   }
//   next();
// };

// const protectedMiddleware = (req, res, next) => {
//   const url = req.url;
//   if (url === "/protected") {
//     return res.end();
//   }
//   next();
// };

// app.use(urlLogger, timeLogger, securityLogger, protectedMiddleware);
// app.get("/", (req, res) => res.send("<h1>Home</h1>"));
// app.get("/protected", protectedMiddleware);

// const handleListening = () => {
//   console.log(`server listening on port http://localhost:${PORT}`);
// };

// // Codesandbox gives us a PORT :)
// app.listen(PORT, handleListening);

// ===================================================================================================
