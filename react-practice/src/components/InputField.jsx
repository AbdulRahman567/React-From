import { useState } from 'react';

/**
 * Reusable form input wired for Formik's error/touched pattern.
 * For type="password" it adds its own show/hide toggle, since both the
 * login and register forms need that and it shouldn't be reimplemented
 * twice.
 *
 * Props:
 *  - label, name, type, placeholder
 *  - value, onChange, onBlur (passed straight from Formik)
 *  - error, touched (used together to decide whether to show the error)
 */
function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const resolvedType = isPasswordField && showPassword ? 'text' : type;

  // Only show the error once the field has been touched — otherwise every
  // field would show "required" before the user has even reached it.
  const hasError = Boolean(touched && error);

  return (
    <div className="input-field">
      <label htmlFor={name} className="input-field__label">
        {label}
      </label>

      <div className="input-field__control">
        <input
          id={name}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`input-field__input ${hasError ? 'input-field__input--error' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />

        {isPasswordField && (
          <button
            type="button"
            className="input-field__toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            // Prevents the toggle from triggering Formik's blur validation
            // by stealing focus in a way that feels jarring mid-click.
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {hasError && (
        <p id={`${name}-error`} className="input-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
