import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MovieSearchPage from '../src/pages/MovieSearchPage.jsx';

const { search } = vi.hoisted(() => ({
  search: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/hooks/useMovies.js', () => ({
  useMovies: () => ({ movies: [], search }),
}));

function CurrentSearch() {
  const location = useLocation();
  return <output data-testid="current-search">{location.search}</output>;
}

describe('MovieSearchPage', () => {
  beforeEach(() => {
    search.mockClear();
    search.mockResolvedValue(undefined);
  });

  it('restores filters and reruns a search from the URL', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/movies?title=Arrival&genre=Drama&year=2016&searched=1',
        ]}
      >
        <MovieSearchPage />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('title')).toHaveValue('Arrival');
    expect(screen.getByRole('combobox')).toHaveValue('Drama');
    expect(screen.getByPlaceholderText('year')).toHaveValue(2016);
    await waitFor(() => {
      expect(search).toHaveBeenCalledWith({
        title: 'Arrival',
        genre: 'Drama',
        year: '2016',
      });
    });
    expect(screen.getByText('No movies found.')).toBeInTheDocument();
  });

  it('puts submitted filters in the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/movies']}>
        <CurrentSearch />
        <MovieSearchPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('title'), {
      target: { value: 'Arrival' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Drama' },
    });
    fireEvent.change(screen.getByPlaceholderText('year'), {
      target: { value: '2016' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'search!' }));

    await waitFor(() => {
      expect(screen.getByTestId('current-search')).toHaveTextContent(
        '?title=Arrival&genre=Drama&year=2016&searched=1',
      );
    });
    await waitFor(() => {
      expect(search).toHaveBeenCalledWith({
        title: 'Arrival',
        genre: 'Drama',
        year: '2016',
      });
    });
  });
});
