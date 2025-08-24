import './index.css';
import { enableValidation, validationConfig } from '../scripts/validation.js';
import { setButtonText, resetButtonText } from '../utils/helpers.js';
import Api from '../utils/Api.js';

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1/",
  headers: {
    authorization: "81e5442c-2519-4d01-9789-e914b59f187c",
    "Content-Type": "application/json"
  }
});

// Elements
const cardTemplate = document.querySelector("#card-template").content.querySelector(".gallery__card");
const galleryList = document.querySelector(".gallery__list");

const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__title");
const avatarImage = document.querySelector(".profile__photo");

const editProfileBtn = document.querySelector(".profile__edit");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__post");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const imageLinkInput = document.querySelector("#image-link-input");
const captionInput = document.querySelector("#post-caption-input");

const avatarElement = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = document.querySelector("#edit-avatar-form");
const avatarInput = document.querySelector("#profile-avatar-input");

const previewPostModal = document.querySelector('#preview-post-modal');
const previewModalCloseBtn = previewPostModal.querySelector('.modal__close-btn');
const previewElementImage = previewPostModal.querySelector('.modal__image');
const previewCaption = previewPostModal.querySelector('.modal__preview-caption');

const deleteModal = document.getElementById('edit-delete-modal');
const deleteForm = document.getElementById('delete-form');

let cardToDelete = null;
let selectedCardId = null;

// ---------- Modal Handling ----------
function handleOverlayClick(event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target);
  }
}

function handleEscKey(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.modal_is-opened');
    if (openedModal) closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener('keydown', handleEscKey);
  modal.addEventListener('mousedown', handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener('keydown', handleEscKey);
  modal.removeEventListener('mousedown', handleOverlayClick);
}

// ---------- Card Creation ----------
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardElementTitle = cardElement.querySelector(".gallery__text");
  const cardElementImage = cardElement.querySelector(".gallery__image");
  const cardLikeBtn = cardElement.querySelector(".gallery__icon");
  const cardDeleteBtn = cardElement.querySelector(".gallery__icon-delete");

  cardElementImage.src = data.link;
  cardElementImage.alt = data.name;
  cardElementTitle.textContent = data.name;

  // Set initial like state
  if (data.isLiked) {
    cardLikeBtn.classList.add("gallery__icon_liked");
  }

  // Like toggle
  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("gallery__icon_liked");
    const toggleLike = isLiked ? api.removeLike : api.addLike;

    toggleLike.call(api, data._id)
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeBtn.classList.add("gallery__icon_liked");
        } else {
          cardLikeBtn.classList.remove("gallery__icon_liked");
        }
      })
      .catch(console.error);
  });

  // Delete
  cardDeleteBtn.addEventListener("click", () => {
    cardToDelete = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  // Preview
  cardElementImage.addEventListener("click", () => {
    previewElementImage.src = data.link;
    previewElementImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewPostModal);
  });

  return cardElement;
}

// ---------- API Data Load ----------
api.getAppInfo()
  .then(([userInfo, initialCards]) => {
    profileNameElement.textContent = userInfo.name;
    profileJobElement.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
    avatarImage.alt = `${userInfo.name}'s avatar`;

    initialCards.forEach((item) => {
      const cardElement = getCardElement(item);
      galleryList.append(cardElement);
    });
  })
  .catch((error) => console.error('Error loading app info:', error));

// ---------- Delete Card ----------
deleteForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (selectedCardId && cardToDelete) {
    api.removeCard(selectedCardId)
      .then(() => {
        cardToDelete.remove();
        cardToDelete = null;
        selectedCardId = null;
        closeModal(deleteModal);
      })
      .catch(console.error);
  }
});

const deleteCancelBtn = deleteModal.querySelector('.modal__submit-btn-cancel');

deleteCancelBtn.addEventListener('click', () => {
  closeModal(deleteModal);
  cardToDelete = null;
  selectedCardId = null;
});

const deleteCloseBtn = deleteModal.querySelector('.delete-close-btn');

deleteCloseBtn.addEventListener('click', () => {
  closeModal(deleteModal);
  cardToDelete = null;
  selectedCardId = null;
});


// ---------- Edit Profile ----------
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = profileFormElement.querySelector('.modal__submit-btn');
  const originalText = submitBtn.textContent;

  setButtonText(submitBtn, 'Saving...');

  api.editUserInfo({
    name: nameInput.value,
    about: jobInput.value
  })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileJobElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => resetButtonText(submitBtn, originalText));
}

// ---------- Add New Card ----------
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = addCardFormElement.querySelector('.modal__submit-btn');
  const originalText = submitBtn.textContent;

  setButtonText(submitBtn, 'Saving...');

  api.addNewCard({
    name: captionInput.value,
    link: imageLinkInput.value
  })
    .then((data) => {
      const cardElement = getCardElement(data);
      galleryList.prepend(cardElement);
      closeModal(newPostModal);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => resetButtonText(submitBtn, originalText));
}

// ---------- Edit Avatar ----------
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector('.modal__submit-btn');
  const originalText = submitBtn.textContent;

  setButtonText(submitBtn, 'Saving...');

  api.editAvatar(avatarInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => resetButtonText(submitBtn, originalText));
});

// ---------- Event Listeners ----------
editProfileBtn.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewPostModal));

avatarElement.addEventListener("click", () => openModal(avatarModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
addCardFormElement.addEventListener("submit", handleAddCardSubmit);

enableValidation(validationConfig);
