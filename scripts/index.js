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
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener('keydown', handleEscKey);
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

const previewPostModal = document.querySelector('#preview-post-modal');
const previewModalCloseBtn = previewPostModal.querySelector('.modal__close-btn');
const previewElementImage = previewPostModal.querySelector('.modal__image');
const previewCaption = previewPostModal.querySelector('.modal__preview-caption');

const cardTemplate = document
  .querySelector("#card-template")
  .content
  .querySelector(".gallery__card");

const galleryList = document.querySelector(".gallery__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardElementTitle = cardElement.querySelector(".gallery__text");
  const cardElementImage = cardElement.querySelector(".gallery__image");

  cardElementImage.src = data.link;
  cardElementImage.alt = data.name;
  cardElementTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".gallery__icon");
  const cardDeleteBtn = cardElement.querySelector(".gallery__icon-delete");

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("gallery__icon_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardElementImage.addEventListener("click", () => {
    previewElementImage.src = data.link;
    previewElementImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewPostModal);
  });

  return cardElement;
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: captionInput.value,
    link: imageLinkInput.value,
  };

  const cardElement = getCardElement(inputValues);
  galleryList.prepend(cardElement);

  closeModal(newPostModal);
  evt.target.reset();
}

// Open edit modal with values & clear errors
editProfileBtn.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;

  const inputs = [nameInput, jobInput];
  inputs.forEach(input => {
    input.setCustomValidity('');
    const errorElement = profileFormElement.querySelector(`#${input.id}-error`);
    errorElement.textContent = "";
    errorElement.classList.remove("modal__error_visible");
    input.classList.remove("modal__input_type_error");
  });

  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewPostModal));
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
addCardFormElement.addEventListener("submit", handleAddCardSubmit);

// Close modals by clicking overlay
document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('mousedown', handleOverlayClick);
});

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  },
];

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  galleryList.append(cardElement);
});
