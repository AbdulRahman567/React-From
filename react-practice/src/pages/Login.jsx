import { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { loginSchema } from '../validation/authSchema';
import { useAuth } from '../hooks/useAuth';

const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState('');

  // "Remember me" pre-fills the email field on future visits — it does not
  // affect the actual session, which authService already persists.
  const [rememberMe, setRememberMe] = useState(
    Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY))
  );

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem(REMEMBERED_EMAIL_KEY) || '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError('');

      try {
        await login(values);

        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }

        navigate('/dashboard');
      } catch (error) {
        // Covers both "no such user" and "wrong password" — authService
        // intentionally returns one generic message for both.
        setSubmitError(error.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Log in to continue.</p>

        <form onSubmit={formik.handleSubmit} noValidate>
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
            placeholder="Your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          <label className="auth-card__remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember my email
          </label>

          {submitError && <p className="form-message form-message--error">{submitError}</p>}

          <button
            type="submit"
            className="auth-card__submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
