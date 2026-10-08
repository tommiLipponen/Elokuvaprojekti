import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';

describe('App routing', () => {
  it('renders the home page and navbar at /', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByRole('heading', { name: 'find your next favorite movie' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'search' })).toBeInTheDocument();
  });

  it('renders the movie detail page for /movies/:id', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/movies/42']}>
          <App />
        </MemoryRouter>
      </AuthProvider>,
    );

    // "go back" is present in every load state (loading/not found/loaded), so it's a stable anchor
    expect(await screen.findByRole('button', { name: 'go back' })).toBeInTheDocument();
  });
});
