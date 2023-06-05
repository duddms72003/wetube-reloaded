import mongoose from "mongoose";

// export const formatHashtags = (hashtags) =>
//   hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 }, //근데 title이랑 description에 default를 안준거는 뭐가 기준이 될 줄 알고 기본값을 주어주나! 뭐가 제목이 되고 뭐가 설명이 될지 아무도 머르는뎅 / 그래서 기본값 적용을 따로 안해준거임 / trim 기능 : 빈칸(띄어쓰기) 없애기
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, default: Date.now, required: true }, //Date.now 에서 () 를 안쓴 이유 = 우리가 video를 만들었을때만 해당 함수를 실행시키고싶어서
  //날짜도 오늘 날짜를 기본으로 설정하고 싶으니까 defalut 해준거임
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true }, //default로 기본값을 지정해줌으로서 굳이 다시 Video.create할 때(db에 저장할 떄) 한 번 더 정보를 전달해주지 않아도 여기서 default로 지정해줬기 때문에 굳이 다시 내보내지 않아도 되는거.
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//"Video, 모델 이름으로 아무거나 지어준거임 "
const Video = mongoose.model("Video", videoSchema);

Video.find({}, (err, users) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(users); // 조회된 사용자 데이터 출력
});

// Video.remove({}, (err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("데이터 삭제 완료");
// });

export default Video;
