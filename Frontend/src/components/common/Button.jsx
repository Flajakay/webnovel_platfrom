import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  as = 'button',
  to,
  ...props 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-gray-100',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 disabled:text-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    link: 'bg-transparent text-indigo-600 hover:text-indigo-800 hover:underline p-0 focus:ring-0 disabled:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300',
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-1',
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Detect if className includes custom styling that would conflict with variant styling
  const hasCustomBg = className.includes('bg-');
  const hasCustomText = className.includes('text-');
  const hasCustomBorder = className.includes('border-');
  
  // Build variant classes conditionally
  let finalVariantClasses = variantClasses[variant];
  if (hasCustomBg) {
    // Remove bg-* classes from variant
    finalVariantClasses = finalVariantClasses.replace(/bg-\S+\s?/g, '');
  }
  if (hasCustomText) {
    // Remove text-* classes from variant
    finalVariantClasses = finalVariantClasses.replace(/text-\S+\s?/g, '');
  }
  if (hasCustomBorder) {
    // Remove border-* classes from variant
    finalVariantClasses = finalVariantClasses.replace(/border(-\S+)?\s?/g, '');
  }
  
  // Combine all classes
  const classes = `${baseClasses} ${finalVariantClasses} ${sizeClasses[size]} ${className}`;
  
  // Render as Link if 'to' prop is provided
  if (as === 'link' || to) {
    return (
      <Link 
        to={to} 
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  // Render as button by default
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;