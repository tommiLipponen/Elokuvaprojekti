import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Navbar from '../src/components/Navbar.jsx';
import { useAuth } from '../src/context/useAuth.js';

vi.mock('../src/context/useAuth.js', () => ({
  useAuth: vi.fn(),
}));

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a login link and hides account links when logged out', () => {
    useAuth.mockReturnValue({ accessToken: null, user: null, logout: vi.fn() });

    renderNavbar();

    expect(screen.getByRole('link', { name: 'login' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'profile' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'logout' })).not.toBeInTheDocument();
  });

  it('greets the user and shows account links when logged in', () => {
    useAuth.mockReturnValue({
      accessToken: 'token',
      user: { username: 'veera' },
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByText('hi, veera')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'favorites' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'profile' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'login' })).not.toBeInTheDocument();
  });

  it('calls logout when the logout link is clicked', () => {
    const logout = vi.fn().mockResolvedValue();
    useAuth.mockReturnValue({ accessToken: 'token', user: { username: 'veera' }, logout });

    renderNavbar();

    fireEvent.click(screen.getByRole('link', { name: 'logout' }));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('always renders the public navigation links regardless of auth state', () => {
    useAuth.mockReturnValue({ accessToken: null, user: null, logout: vi.fn() });

    renderNavbar();

    expect(screen.getByRole('link', { name: 'search' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'in cinemas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'shared lists' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'groups' })).toBeInTheDocument();
  });
});
