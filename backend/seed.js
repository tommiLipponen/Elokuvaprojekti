// Baseline movie import for local/dev/shared databases (PBI 28, ADO 140).
// Run: node seed.js            (uses the committed snapshot if present)
//      node seed.js --refresh  (re-fetches from TMDB and overwrites the snapshot)
require('dotenv').config();

const path = require('path');
const fs = require('fs/promises');
const { getPrisma } = require('./config/prisma');
const {
  fetchCuratedMovies,
  fetchGenres,
  upsertMovies,
  upsertGenres,
} = require('./modules/movies/movies.import.service');

const SNAPSHOT_PATH = path.join(__dirname, 'prisma', 'seed-data', 'movies.json');
const TARGET_MOVIE_COUNT = 1500;

async function loadSnapshot() {
  try {
    const raw = await fs.readFile(SNAPSHOT_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function saveSnapshot(snapshot) {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
}

async function main() {
  const refresh = process.argv.includes('--refresh');
  let snapshot = refresh ? null : await loadSnapshot();

  if (!snapshot) {
    console.log(`Fetching curated movie list from TMDB (target ~${TARGET_MOVIE_COUNT} movies)...`);
    const [movies, genres] = await Promise.all([
      fetchCuratedMovies({ targetCount: TARGET_MOVIE_COUNT }),
      fetchGenres(),
    ]);
    snapshot = { fetchedAt: new Date().toISOString(), movies, genres };
    await saveSnapshot(snapshot);
    console.log(`Saved snapshot with ${movies.length} movies to ${path.relative(__dirname, SNAPSHOT_PATH)}`);
  } else {
    console.log(
      `Using committed snapshot (fetched ${snapshot.fetchedAt}, ${snapshot.movies.length} movies). `
        + 'Pass --refresh to re-fetch from TMDB instead.',
    );
  }

  const prisma = await getPrisma();
  try {
    console.log(`Upserting ${snapshot.genres.length} genres...`);
    await upsertGenres(prisma, snapshot.genres);

    console.log(`Upserting ${snapshot.movies.length} movies...`);
    await upsertMovies(prisma, snapshot.movies);

    console.log('Baseline movie import complete.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
