/**
 * A map of technical error codes or names to user-friendly messages.
 * This includes common AWS Cognito errors and general request errors.
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Cognito Sign Up / Sign In
  UsernameExistsException: "An account with this email already exists.",
  UserNotFoundException: "Account not found. Please sign up first.",
  NotAuthorizedException: "Incorrect email or password.",
  InvalidParameterException: "Please check your information and try again.",
  CodeMismatchException: "The verification code is incorrect.",
  ExpiredCodeException: "This code has expired. Please request a new one.",
  PasswordResetRequiredException: "You need to reset your password.",
  UserNotConfirmedException: "Please verify your email address before logging in.",
  LimitExceededException: "Too many attempts. Please try again later.",

  // General Network / API
  TypeError: "Unable to connect to the server. Please check your internet connection.",
  FailedToFetch: "Network error. Please try again.",
};

/**
 * Translates a technical error into a user-friendly string.
 * @param error - The error object to translate (can be an Error instance or an Amplify error).
 * @returns A friendly error message for the UI.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const genericFallback = "An unexpected error occurred. Please try again later.";
  if (!error) return genericFallback;

  const err = error as { name?: string; code?: string; message?: string };
  const key = err.name || err.code;

  if (key && ERROR_MESSAGES[key]) {
    return ERROR_MESSAGES[key];
  }

  if (err.message) {
    if (err.message.includes("Failed to fetch")) return ERROR_MESSAGES.FailedToFetch;

    return err.message;
  }


  return genericFallback;
}
