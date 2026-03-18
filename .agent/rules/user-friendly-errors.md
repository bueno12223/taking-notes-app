---
trigger: always_on
---

# User Friendly Errors

Raw technical error messages (stack traces, internal system codes, or complex cloud provider error names) must NEVER be displayed directly to the user in the UI.

## Implementation Rules
1. All errors displayed in **toasts**, **form validation summaries**, or **alerts** must be passed through the `getFriendlyErrorMessage` utility in `src/lib/error-mapping.ts`.
2. If an error is unknown or unmapped, the utility must provide a polite, generic fallback message (e.g., "An unexpected error occurred. Please try again later.").
3. When adding new external services (e.g., more AWS services or third-party APIs), update the mapping in `src/lib/error-mapping.ts` to include their specific error codes.
4. the next app is responsable to translade this error messages, not the backend

## Rationale
Technical error messages confuse users and potentially leak implementation details. Standardizing messages ensures a consistent and professional user experience.
