import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

//비밀번호 해싱처리
//userSchema.pre("save", ==> 저장하기 전에 잠깐 가로채서 작업 할 수 있는 기능을 가짐.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

User.find({}, (err, users) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(users); // 조회된 사용자 데이터 출력
});

// User.remove({}, (err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("데이터 삭제 완료");
// });

export default User;
