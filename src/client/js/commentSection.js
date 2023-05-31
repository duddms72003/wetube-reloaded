const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
//댓글 삭제 테스트
const deleteBtn = document.querySelectorAll(".delete_btn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `  ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

//댓글 삭제 테스트
const handleDelete = async (event) => {
  //   const comment = event.target.closest(".video__comment");
  //   if (comment) {
  //     const commentId = comment.dataset.id;
  //     await fetch(`/api/comments/${commentId}`, {
  //       method: "DELETE",
  //     });
  //     comment.remove();
  //     // console.log("댓글이 삭제되었습니다.");
  //   }

  const comment = event.target.closest(".video__comment");
  const commentId = comment.dataset.id;
  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  comment.remove();
};

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", handleDelete);
});
