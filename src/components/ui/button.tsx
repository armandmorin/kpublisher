import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const getButtonStyles = (variant: ButtonVariant = 'default', size: ButtonSize = 'default', className?: string) => {
  // Base styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap' as const,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'colors 0.2s ease',
    cursor: 'pointer',
  };

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    destructive: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    outline: {
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#171717',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#171717',
    },
    link: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    },
  };

  // Size styles
  const sizeStyles = {
    default: {
      height: '2.25rem',
      padding: '0.5rem 1rem',
    },
    sm: {
      height: '2rem',
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
    },
    lg: {
      height: '2.5rem',
      padding: '0.5rem 2rem',
    },
    icon: {
      height: '2.25rem',
      width: '2.25rem',
      padding: '0',
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const buttonStyles = getButtonStyles(variant, size);

    return (
      <Comp
        style={{ ...buttonStyles, ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
