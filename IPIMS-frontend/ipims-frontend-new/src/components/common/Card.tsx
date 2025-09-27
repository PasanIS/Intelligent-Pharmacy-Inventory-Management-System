import React from 'react';
import '../../styles/common/card.css';

interface CardProps {
  title?: string;
  value?: string | number;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, children, className = '' }) => {
  if (children) {
    return (
      <div className={`card ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      <p className="card-value">{value}</p>
    </div>
  );
};

export default Card;