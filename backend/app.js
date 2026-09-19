const path = require('path');
const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./users/user.routes');
const movieRoutes = require('./modules/movies/movies.routes');
const groupRoutes = require('./modules/groups/groups.routes');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/groups', groupRoutes);

// Serve the built React SPA if present (populated by the deploy pipeline, not present in local dev)
const frontendDist = path.join(__dirname, 'public');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // Express 5 requires a named wildcard instead of a bare '*'
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

module.exports = app;