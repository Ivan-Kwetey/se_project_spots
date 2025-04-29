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

const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__title");

const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");

const addCardFormElement = newPostModal.querySelector(".modal__form");
const imageLinkInput = newPostModal.querySelector("#image-link-input");
const captionInput = newPostModal.querySelector("#post-caption-input");

editProfileBtn.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));

newPostBtn.addEventListener("click", () => openModal(newPostModal));

newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log("Image Link:", imageLinkInput.value);
  console.log("Caption:", captionInput.value);
  closeModal(newPostModal);
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);
