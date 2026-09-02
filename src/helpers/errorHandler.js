export function showError(inputEl, message) {
  const group = inputEl.closest(".input-group");
  const errorSpan = group.querySelector(".error-msg");

  group.classList.add("invalid");
  inputEl.setAttribute("aria-invalid", "true");
  if (errorSpan) errorSpan.textContent = message;
}

// Helper: Clear error state
export function clearError(inputEl) {
  const group = inputEl.closest(".input-group");
  const errorSpan = group.querySelector(".error-msg");

  group.classList.remove("invalid");
  inputEl.removeAttribute("aria-invalid");
  if (errorSpan) errorSpan.textContent = "";
}
