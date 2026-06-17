import { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { registerSchema } from '../validation/authSchema';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Separate from Formik's own error/touched state: this holds errors that
  // come back from the "server" (e.g. email already registered), which
  // Yup has no way of knowing about ahead of time.
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    // onSubmit only runs after validation passes, so an empty or invalid
    // submission never reaches this function — Formik handles that edge
    // case for us and marks every field as touched instead.
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      setSuccessMessage('');

      try {
        await register(values);
        setSuccessMessage('Account created! Redirecting to your dashboard…');
        resetForm();
        // Small delay purely so the success message is visible before
        // the redirect, rather than an instant jump.
        setTimeout(() => navigate('/dashboard'), 900);
      } catch (error) {
        // Covers the "email already exists" edge case from authService.
        setSubmitError(error.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Practice registration form — no real data leaves your browser.</p>

        <form onSubmit={formik.handleSubmit} noValidate>
          <InputField
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Jane Doe"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.fullName}
            touched={formik.touched.fullName}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          <InputField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
          />

          {submitError && <p className="form-message form-message--error">{submitError}</p>}
          {successMessage && <p className="form-message form-message--success">{successMessage}</p>}

          {/* disabled covers both "currently submitting" and prevents the
              double-submit edge case from a rapid double-click */}
          <button
            type="submit"
            className="auth-card__submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
