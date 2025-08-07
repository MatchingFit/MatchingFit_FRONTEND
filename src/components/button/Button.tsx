import React from 'react';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string;
  variant: 'primary' | 'white';
  size: 'lg' | 'md' | 'sm';
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
