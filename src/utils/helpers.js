export function renderLoading(
  button,
   isLoading,
    loadingText = "Saving...",
     defaultText = "Save"
    ) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(submitButton, true, loadingText, initialText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
     renderLoading(submitButton, false, loadingText, initialText);
    });
}