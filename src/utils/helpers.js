export function setButtonText(
  button,
   isLoading,
    loadingText = "Save",
     defaultText = "Saving..."
    ) {
  if (isLoading) {
    button.textContent = loadingText;
    console.log(`Setting text to ${loadingText}`);
  } else {
    button.textContent = defaultText;
  }
}