// src/components/Dashboard/DashboardCard.tsx
import React from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  color?: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  children, 
  className = '', 
  href, 
  color = 'blue',
  onClick 
}) => {
  const cardClasses = `${styles.card} ${styles[color]} ${className}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default DashboardCard;