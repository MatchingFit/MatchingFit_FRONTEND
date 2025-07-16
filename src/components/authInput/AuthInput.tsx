import React from 'react';
import styles from './AuthInput.module.css';

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  description?: string;
  errors?: string[];
};

const AuthInput: React.FC<AuthInputProps> = ({
  type = 'text',
  value,
  placeholder,
  onChange,
  label,
  description,
  errors = [],
  ...props
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={label} className={styles.label}>
          {label}
        </label>
      )}
      {description && <p className={styles.description}>{description}</p>}
      <input
        className={`${styles.inputBox} ${errors.length > 0 ? styles.errorBorder : ''}`}
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
          }
        }}
        autoComplete="off"
        {...props}
      />
      {errors.length > 0 && (
        <ul className={styles.errorList}>
          {errors.map((err, idx) => (
            <li key={idx}>
              <p>{err}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthInput;
