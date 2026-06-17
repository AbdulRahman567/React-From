import * as Yup from 'yup';
import { NAME_REGEX, HAS_UPPERCASE, HAS_LOWERCASE, HAS_NUMBER, HAS_SPECIAL_CHAR } from '../utils/validators';

// Schema for the registration form.
// Every rule maps directly to a requirement in the spec, with a specific
// error message per rule so Formik can show exactly what's wrong.
export const registerSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .matches(NAME_REGEX, 'Name cannot contain numbers or symbols'),

  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(HAS_UPPERCASE, 'Password must contain an uppercase letter')
    .matches(HAS_LOWERCASE, 'Password must contain a lowercase letter')
    .matches(HAS_NUMBER, 'Password must contain a number')
    .matches(HAS_SPECIAL_CHAR, 'Password must contain a special character'),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    // Yup.ref lets this field validate against the live value of "password"
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

// Schema for the login form — lighter, since we don't re-check password
// strength on login (a previously valid account may predate stricter rules).
export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),

  password: Yup.string()
    .required('Password is required'),
});
