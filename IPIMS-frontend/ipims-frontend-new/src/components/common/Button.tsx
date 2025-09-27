import React from 'react';
import '../../styles/common/button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'link';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;