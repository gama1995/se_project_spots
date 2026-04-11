export const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__input-error_active"
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.classList.add(config.errorClass);
    errorMsgEl.textContent = errorMsg; 
    inputEl.classList.add(config.inputErrorClass);
};


const hideInputError = (formEl, inputEl, config) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.classList.remove(config.errorClass);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
        hideInputError(formEl, inputEl, config);
    }

};

const hasInvalidInput = (inputList) => {
    return inputList.some((inputEl) => {
        return !inputEl.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonEl, config) => {
    if (hasInvalidInput(inputList)) {
        disableButton(buttonEl, config);

    } else {
buttonEl.classList.remove('gray-modifier');
buttonEl.classList.remove(config.inactiveButtonClass);
buttonEl.disabled = false;

    }
};

export const disableButton = (buttonEl, config) => {
    buttonEl.disabled = true;
     buttonEl.classList.add('gray-modifier');
    buttonEl.classList.add(config.inactiveButtonClass);
}

export const resetValidation = (formEl, inputList, config) => {
    inputList.forEach((inputEl) => {
        hideInputError(formEl, inputEl, config);
    });
};

const setEventListeners = (formEl, config) => {
const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

 

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
setEventListeners(formEl, config);
 });
};

