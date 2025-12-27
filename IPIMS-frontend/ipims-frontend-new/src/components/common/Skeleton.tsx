import React from 'react';


interface SkeletonProps {
    type?: 'text' | 'rect';
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
    type = 'text',
    width,
    height,
    className = '',
    style = {}
}) => {
    const combinedStyle: React.CSSProperties = { ...style };
    if (width) combinedStyle.width = width;
    if (height) combinedStyle.height = height;

    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={combinedStyle}
        />
    );
};

export default Skeleton;
