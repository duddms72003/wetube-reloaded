import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  //여기가 하나라도 잘못되면 fetch 타입에러가 남 / 지금 creator 넣어두니까 에러 나옴 다시 잘 해보자
  // creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "User",
  // },
  creatorUsername: { type: String, required: true }, //이거 하나만 우선 추가
  creatorAvatarUrl: String,
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

//-------------- 테스트중
// Comment.find()
//   .populate("owner")
//   .exec((err, comments) => {
//     if (err) {
//       console.error(err); // 오류 출력
//       return;
//     }
//     comments.forEach((comment) => {
//       if (comment.owner) {
//         console.log("찾는거야?", comment.owner);
//       } else {
//         console.log("Owner not found");
//       }
//     });
//   });
//-------------- 테스트중
export default Comment;
