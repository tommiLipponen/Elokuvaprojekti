const path = require('path');
const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./users/user.routes');
const movieRoutes = require('./modules/movies/movies.routes');
const groupRoutes = require('./modules/groups/groups.routes');
const favoriteRoutes = require('./modules/favorites/favorites.routes');
const membershipsRoutes = require('./modules/memberships/memberships.routes');
const reviewRoutes = require('./modules/reviews/reviews.routes');

const app = express();

app.use(express.json());

// Serve the built React SPA if present (populated by the deploy pipeline, not present in local dev)
const frontendDist = path.join(__dirname, 'public');
const serveFrontend = fs.existsSync(frontendDist);

if (serveFrontend) {
  app.use(express.static(frontendDist));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

if (serveFrontend) {
  // Real browser navigations (hard refresh / typed URL) send Sec-Fetch-Mode: navigate,
  // which fetch() calls never send. Always serve the SPA for those before any API route
  // gets a chance to claim the path (e.g. /movies/:id, /groups/:id are also API routes).
  app.get('/{*splat}', (req, res, next) => {
    if (req.headers['sec-fetch-mode'] === 'navigate') {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/movies', reviewRoutes);

// Groups/favorites are only ever called via /api/*, so no bare mount here —
// a bare mount would collide with the SPA's identical client-side routes on reload.
app.use('/api/groups', groupRoutes);
app.use('/api/groups', membershipsRoutes);
app.use('/api/favorites', favoriteRoutes);

if (serveFrontend) {
  // Final fallback for navigations without Sec-Fetch-Mode (older browsers) or any
  // unmatched path.
  // Express 5 requires a named wildcard instead of a bare '*'
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

module.exports = app;