import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Mock localStorage and matchMedia
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders correctly and toggles theme on click', () => {
    render(<ThemeToggle />);
    
    // By default (no localStorage, and light mode mocked), it should render light icon
    const button = screen.getByLabelText('Cambiar tema');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('🌙'); // Light mode shows moon icon to switch to dark

    // Click to toggle to dark
    fireEvent.click(button);
    expect(button.textContent).toBe('☀️'); // Dark mode shows sun icon
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
