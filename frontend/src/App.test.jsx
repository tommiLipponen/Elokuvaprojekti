import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App routing', () => {
  it('renders the home page and navbar at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Movie Search' })).toBeInTheDocument();
  });

  it('renders the movie detail page for /movies/:id', () => {
    render(
      <MemoryRouter initialEntries={['/movies/42']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Movie Detail' })).toBeInTheDocument();
  });
});
