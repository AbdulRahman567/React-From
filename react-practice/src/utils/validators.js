// Raw validation building blocks.
// Kept separate from validation/authSchema.js so the regex/logic isn't
// duplicated and the Yup schema file can stay purely declarative.

// Name must contain only letters and spaces (no digits, no symbols).
export const NAME_REGEX = /^[A-Za-z\s]+$/;

// At least one lowercase letter.
export const HAS_LOWERCASE = /[a-z]/;

// At least one uppercase letter.
export const HAS_UPPERCASE = /[A-Z]/;

// At least one digit.
export const HAS_NUMBER = /[0-9]/;

// At least one special character (anything that isn't a word char or space).
export const HAS_SPECIAL_CHAR = /[^A-Za-z0-9\s]/;

/**
 * Returns true if the email looks structurally valid.
 * Yup's .email() already does this, but this is exposed separately
 * in case a component needs to check it outside of Formik (e.g. on blur).
 */
export const isValidEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Breaks a password down into a small report of which rules pass.
 * Useful for showing a live "password strength" checklist in the UI,
 * not just a single pass/fail error message.
 */
export const getPasswordChecks = (value = '') => ({
  minLength: value.length >= 8,
  hasUppercase: HAS_UPPERCASE.test(value),
  hasLowercase: HAS_LOWERCASE.test(value),
  hasNumber: HAS_NUMBER.test(value),
  hasSpecialChar: HAS_SPECIAL_CHAR.test(value),
});

/**
 * True only if every password rule passes.
 */
export const isStrongPassword = (value = '') => {
  const checks = getPasswordChecks(value);
  return Object.values(checks).every(Boolean);
};
