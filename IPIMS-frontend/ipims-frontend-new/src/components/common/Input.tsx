import React from 'react';
import '../../styles/common/input.css';

interface InputProps {
  id?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  min?: string;
  step?: string;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  min,
  step,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="input-wrapper">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        disabled={disabled}
        required={required}
        className={error ? 'input error' : 'input'}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;