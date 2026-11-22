/**
 * FormSubmit's AJAX API may return HTTP 200 with success: "false".
 * Accept only its explicit true response (boolean or string).
 */
export function isFormSubmitSuccess(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const success = (value as { success?: unknown }).success;
  return success === true || success === "true";
}

export function getFormSubmitError(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim().slice(0, 240);
    }
  }
  return "FormSubmit could not accept your message. Please email me directly.";
}
