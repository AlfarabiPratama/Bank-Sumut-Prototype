import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-white border border-gray-200 shadow-sm',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
  gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md',
  outline: 'bg-transparent border-2 border-gray-200',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  const baseStyles = 'rounded-xl transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="font-semibold text-gray-900">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
