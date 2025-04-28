
const MODAL_OPEN_CLASS = "modal_is-opened";
function openModal(modal) {
  modal.classList.add(MODAL_OPEN_CLASS);
}

function closeModal(modal) {
  modal.classList.remove(MODAL_OPEN_CLASS);
}

const editProfileBtn = document.querySelector(".profile__edit");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const newPostBtn = document.querySelector(".profile__post");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

editProfileBtn.addEventListener("click", () => openModal(editProfileModal));
editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));

newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
