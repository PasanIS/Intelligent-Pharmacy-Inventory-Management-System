import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
    it('renders button with children', () => {
        render(<Button onClick={() => { }}>Click Me</Button>);
        const button = screen.getByText('Click Me');
        expect(button).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant class', () => {
        render(<Button onClick={() => { }} variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-secondary');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button onClick={() => { }} disabled>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
