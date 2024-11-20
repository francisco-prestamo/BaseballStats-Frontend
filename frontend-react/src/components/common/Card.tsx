import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`p-6 space-y-1.5 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={`text-xl font-semibold text-text-dark dark:text-text-light ${className}`}
                {...props}
            >
                {children}
            </h3>
        );
    }
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`p-6 pt-0 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
CardContent.displayName = 'CardContent';

export { Card as default};