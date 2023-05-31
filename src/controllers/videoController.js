import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner"); //여기서 모든 Video 모델 객체? 찾아서 불러오고 -> 그걸 render 된 home에서 쓰고 있는거고 / videos는 video들로 구성된 array이고
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; //req.param은 router가 주는 express의 기능
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log(video);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id); //여기 getEdit에서는 video object가 꼭 필요해서 이걸로 사용 / object를 { pageTitle: `Edit: ${video.title}`, video }) 여기로 보내줘야하기 때문
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  // const id = req.params.id; 아래랑 같은거임
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  // const video = await Video.findById(id); //여기 video 는 DB에서 검색한 영상 object임
  const video = await Video.findById(id); //video object를 받는 대신에 true, false를 받고 있음
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    // findByIdAndUpdate - id와 일치하는 것을 쿼리하는 메서드
    //여기 Video는 model Video임
    title,
    description,
    hashtags: Video.formatHashtags(hashtags), //req.body; 위에서 가져온 해쉬태그 인자랑 동일
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  console.log(video, thumb);
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body; // 얘네 다 name 가저온거임
  try {
    const newVideo = await Video.create({
      // create - 컬렉션에 새로운 아이템을 생성해 DB에 저장하는 메서드
      title, //title:title 여기서 앞에 title은 model Video에 있는 String 타입의 title을 가져온거고 뒤에 title은 name의 title을 가져온거임
      description, //얘도 마찬가지
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.unshift(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      //에러일 경우에 catch를 사용해서 에러라는걸 알려줄꺼고 upload 페이지를 재랜더링해서 upload 화면 띄우면서 거기다가 에러메세지 전달해주는거임
      pageTitle: "upload video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query; //req.query 사용조건 : form이 GET 이어야하고, 변수 이름은 input name 이름 정해진대로 들어가야함. 지금은 name="keyword" 라고 되어있음.
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), //title에 검색된 keyword 들어있는거 걸러달라고
      },
    }).populate("owner");
  }
  return res.render("search", {
    pageTitle: "Search",
    videos,
  });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  // console.log(user, text, id);
  // console.log(req.params);
  // console.log(req.body.text);
  // console.log(req.session.user);

  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

//댓글 삭제 테스트
export const deleteComment = async (req, res) => {
  // const {
  //   session: { user },
  //   params: { id },
  // } = req;

  // const video = await Video.findById(id);
  // if (!video) {
  //   return res.sendStatus(404);
  // }

  // const comment = await Comment.findByIdAndDelete({
  //   owner: user._id,
  //   video: id,
  // });

  // video.comments.pull(comment._id);
  // video.save();
  // return res.sendStatus(200);

  const {
    session: {
      user: { _id },
    },
    params: { commentId },
  } = req;

  const comment = await Comment.findById(commentId).populate("owner");

  const videoId = comment.video;
  if (String(_id) !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();
  await Comment.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
