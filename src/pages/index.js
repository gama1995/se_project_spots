import "../pages/index.css";
import {
  resetValidation,
  disableButton,
  enableValidation,
  settings,
} from "../scripts/validation.js";
import { handleSubmit } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "979ab887-9e69-462e-b1a6-633c9b1e32d6",
    "Content-Type": "application/json",
  },
});

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardList = document.querySelector(".cards__list");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostModalForm = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostImageEl = newPostModal.querySelector("#card-image-input");
const newPostDescriptionEl = newPostModal.querySelector("#card-caption-input");

const avatarProfileModal = document.querySelector("#avatar-profile-modal");
const avatarPostBtn = document.querySelector(".profile__avatar-btn");
const avatarProfileCloseBtn = avatarProfileModal.querySelector(".modal__close-btn");
const avatarPostForm = avatarProfileModal.querySelector(".modal__form");
const avatarPostInput = avatarProfileModal.querySelector("#avatar-link-input");

const deleteCardModal = document.querySelector("#delete-avatar-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const deleteCardCloseBtn = deleteCardModal.querySelector(".modal__close-btn");
const deleteCardCancelBtn = deleteCardModal.querySelector(".modal__cancel-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

let selectedCard;
let selectedCardId;

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

function handleDeleteCardSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteCardModal);
    });
  }

  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(id, isLiked)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-btn_active");
      } else {
        likeButton.classList.remove("card__like-btn_active");
      }
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-btn_active");
  }

  likeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
  deleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data._id));
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

api
  .getAppInfo()
  .then(([initialCards, userInfo]) => {
    initialCards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });

    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;
  })
  .catch(console.error);

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));

newPostBtn.addEventListener("click", () => {
  newPostModalForm.reset();
  resetValidation(newPostModalForm, settings);
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

avatarPostBtn.addEventListener("click", () => {
  avatarPostForm.reset();
  resetValidation(avatarPostForm, settings);
  openModal(avatarProfileModal);
});

avatarProfileCloseBtn.addEventListener("click", () => closeModal(avatarProfileModal));

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

deleteCardCloseBtn.addEventListener("click", () => closeModal(deleteCardModal));
deleteCardCancelBtn.addEventListener("click", () => closeModal(deleteCardModal));
deleteCardForm.addEventListener("submit", handleDeleteCardSubmit);

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editUserAvatar({ avatar: avatarPostInput.value }).then((updatedUserInfo) => {
      profileAvatarEl.src = updatedUserInfo.avatar;
      closeModal(avatarProfileModal);
    });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

avatarPostForm.addEventListener("submit", handleAvatarSubmit);

function handleNewPostSubmit(evt) {
  function makeRequest() {
    return api
      .addCard({
        name: newPostDescriptionEl.value,
        link: newPostImageEl.value,
      })
      .then((cardData) => {
        const cardElement = getCardElement(cardData);
        cardList.prepend(cardElement);
        disableButton(newPostSubmitBtn, settings);
        closeModal(newPostModal);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

newPostModalForm.addEventListener("submit", handleNewPostSubmit);

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((updatedUserInfo) => {
        profileNameEl.textContent = updatedUserInfo.name;
        profileDescriptionEl.textContent = updatedUserInfo.about;
        profileAvatarEl.src = updatedUserInfo.avatar;
        closeModal(editProfileModal);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

enableValidation(settings);
