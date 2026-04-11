import "../pages/index.css";
import { resetValidation, disableButton, enableValidation, settings} from  '../scripts/validation.js';
import { setButtonText} from '../utils/helpers.js';
import Api from '../utils/Api.js';


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

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

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
const avatarPostSubmitBtn = avatarProfileModal.querySelector(".modal__submit-btn");

const deleteAvatarModal = document.querySelector("#delete-avatar-modal");
const deleteAvatarForm = deleteAvatarModal.querySelector(".modal__form");


const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");

let selectedCard, selectedCardId;

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  submitButton.textContent = "Deleting...";
  setButtonText(submitButton, true);

  api.deleteCard(selectedCardId)
  .then(() => {
    selectedCard.remove();
    closeModal(deleteAvatarModal);
  })
  .catch(console.error)
  .finally(() => {
    submitButton.textContent = "Deleting...";
    setButtonText(submitButton, false); 
  });
}


function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteAvatarModal);
}


function handleLike(evt, id ) {
const isLiked = evt.target.classList.contains("card__like-btn_active");
api.checkLikeStatus(id, isLiked)
.then((updatedCard) => {
  if (updateCard.isLiked) {
    evt.target.classList.add("card__like-btn_active");
  } else {
  evt.target.classList.remove("card__like-btn_active");
}
})
.catch(console.error);
}

function getCardElement(data) {
const cardElement = cardTemplate.cloneNode(true);

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;

  const captionEl = previewModal.querySelector(".modal__caption");
  captionEl.textContent = data.name;

  openModal(previewModal);
}


const cardTitleEl = cardElement.querySelector(".card__title");
const cardImageEl = cardElement.querySelector(".card__image");
const likeButton = cardElement.querySelector(".card__like-btn");
const deleteButton = cardElement.querySelector(".card__delete-btn");

cardImageEl.src = data.link;
cardImageEl.alt = data.name;
cardTitleEl.textContent = data.name;

isLiked = data.likes.some((like) => like._id === api._userId);
if (data.isLiked) {
  likeButton.classList.add("card__like-btn_active");
}

likeButton.addEventListener("click", (evt) => handleLike(evt, data._id)
);

deleteButton.addEventListener("click", () => 
  handleDeleteCard(cardElement, data._id)
);



cardImageEl.addEventListener("click", () => handleImageClick(data));

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});


  return cardElement; 
}



editProfileBtn.addEventListener("click", function () {
    editProfileNameInput.value = profileNameEl.textContent; 
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
   resetValidation(editProfileForm, [editProfileNameInput, editProfileDescriptionInput ], settings);
    openModal(editProfileModal);
});

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

editProfileCloseBtn.addEventListener("click", function () {
    closeModal(editProfileModal);
});  

newPostBtn.addEventListener("click", function () {
    openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
    closeModal(newPostModal);
});

avatarPostBtn.addEventListener("click", function () {
    openModal(avatarProfileModal);
});

avatarProfileCloseBtn.addEventListener("click", function () {
    closeModal(avatarProfileModal);
});


avatarPostForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const submitButton = evt.subitter;
  submitButton.textContent = "Saving...";
  setButtonText(submitButton, true);

  api.editUserAvatar({avatar: avatarPostInput.value})
  .then((updatedUserInfo) => {
    profileAvatarEl.src = updatedUserInfo.avatar;
    closeModal(avatarProfileModal);
  })
  .catch(console.error)
  .finally(() => {
    submitButton.textContent = "Save";  
    setButtonText(submitButton, false);
  });
});

deleteAvatarForm.addEventListener("submit", handleDeleteCardSubmit);


function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const newPostValues = {
   name: newPostDescriptionEl.value,
    link: newPostImageEl.value,
  };

   api.addCard(newPostValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);

   evt.target.reset();
   disableButton(newPostSubmitBtn, settings);
  closeModal(newPostModal);
})
  .catch(console.error)
  .finally(() => {
    submitButton.textContent = "Save";
    setButtonText(submitButton, false);
  });
}

newPostModalForm.addEventListener("submit", handleNewPostSubmit);

function handleEditProfileSubmit(evt) {
    evt.preventDefault();

    api.editUserInfo({name:editProfileNameInput.value, about:editProfileDescriptionInput.value})
    .then((updatedUserInfo) => {
      profileNameEl.textContent = updatedUserInfo.name;
      profileDescriptionEl.textContent = updatedUserInfo.about;
      profileAvatarEl.src = updatedUserInfo.avatar;
    
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
     setButtonText(submitButton, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);



enableValidation(settings);

