function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} />}
      <h3>{movie.title}</h3>
      {movie.releaseYear && <p>{movie.releaseYear}</p>}
    </div>
  );
}

export default MovieCard;
