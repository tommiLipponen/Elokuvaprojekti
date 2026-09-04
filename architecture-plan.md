# Architecture Plan for the Movie Project

## 1. Overview

This project is a full-stack web application built with React, Node.js, Express, Prisma, and PostgreSQL. The system will support movie browsing, group-based collaboration, social reviews, favorite lists, and user account management.

The architecture is organized in layers so the frontend, backend, and data access concerns remain separate and easy to maintain. The primary design goal is a clear, testable structure that matches the Scrum backlog and supports future iteration by small student teams.

## 2. System Context

The application will provide the following core capabilities:

- User registration, login, logout, and account deletion
- Search for movies and series by multiple criteria
- Browse movies currently showing in Finnish cinemas
- Create and manage movie-related groups
- Request, approve, and remove group members
- Add movies to group pages
- Create and read movie reviews
- Create and share favorite movie lists
- Responsive frontend for desktop and mobile screens

## 3. High-Level Architecture

### 3.1 Frontend

The frontend is built with React and will handle:

- page rendering
- user interaction
- form validation
- API communication
- client-side state for user sessions, groups, and movie data

Recommended frontend structure:

frontend/
├── pages/
│   ├── HomePage
│   ├── LoginPage
│   ├── RegisterPage
│   ├── MovieSearchPage
│   ├── GroupPage
│   ├── UserProfilePage
│   └── FavoriteListPage
├── components/
│   ├── Navbar
│   ├── MovieCard
│   ├── ReviewList
│   ├── GroupList
│   └── FavoriteListCard
├── generated/        # OpenAPI-generated client
├── hooks/
│   ├── useAuth
│   ├── useMovies
│   └── useGroups
├── context/
│   └── AuthContext.jsx
├── layouts/
│   ├── MainLayout
│   └── AuthLayout
└── services/
    ├── authApi
    ├── movieApi
    ├── groupApi
    ├── reviewApi
    └── favoriteApi

### 3.2 Backend

The backend is built with Node.js and Express and will handle:

- route definitions
- request validation
- authentication and authorization logic
- business logic for each feature area
- contract-first API design with OpenAPI/Swagger
- generation of API documentation for frontend and QA use
- integration with Prisma and PostgreSQL
- external movie-provider integration for selected data sources
- automated API test execution for key routes and workflows

Recommended backend structure:

backend/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.validation.js
│   │   ├── token.service.js
│   │   └── auth.middleware.js
│   ├── users/
│   │   ├── users.routes.js
│   │   ├── users.controller.js
│   │   ├── users.service.js
│   │   └── users.validation.js
│   ├── movies/
│   │   ├── movies.routes.js
│   │   ├── movies.controller.js
│   │   ├── movies.service.js
│   │   ├── movies.validation.js
│   │   ├── movies.provider.js
│   │   ├── movies.import.service.js
│   │   ├── movies.cache.service.js
│   │   └── movies.scheduler.js
│   ├── groups/
│   │   ├── groups.routes.js
│   │   ├── groups.controller.js
│   │   ├── groups.service.js
│   │   └── groups.validation.js
│   ├── memberships/
│   │   ├── memberships.routes.js
│   │   ├── memberships.controller.js
│   │   ├── memberships.service.js
│   │   └── memberships.validation.js
│   ├── reviews/
│   │   ├── reviews.routes.js
│   │   ├── reviews.controller.js
│   │   ├── reviews.service.js
│   │   └── reviews.validation.js
│   └── favorites/
│       ├── favorites.routes.js
│       ├── favorites.controller.js
│       ├── favorites.service.js
│       └── favorites.validation.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── swagger/
│   ├── openapi.yaml
│   └── swagger.js
├── app.js
├── server.js
└── config/
    └── env.js

### 3.3 Data Layer

The project uses Prisma as the ORM layer and PostgreSQL as the database.

TMDB is the primary movie provider for the system. It will be used for:

- importing base movie metadata into PostgreSQL
- collecting posters, release dates, genres, and summaries
- supporting live queries such as trending, popular, and upcoming movies
- enriching local records with current external metadata when needed

Prisma will manage:

- user data
- group data
- membership data
- review records
- favorite lists
- movie metadata and references
- group page movie recommendations
- refresh token records for session management

This gives the project a clean persistence layer and easier schema evolution as requirements change.

## 4. Request Flow

A standard application request flow may look like this:

React Page
↓
React Component
↓
API Service
↓
OpenAPI Client
↓
Express Route
↓
Controller
↓
Service
↓
Prisma
↓
PostgreSQL

For protected endpoints, the flow becomes:

React Page
↓
Access Token
↓
Auth Middleware
↓
Controller
↓
Service
↓
Prisma
↓
PostgreSQL

When the access token expires, the client requests a new token from the refresh endpoint:

React Page
↓
/auth/refresh
↓
Refresh Token
↓
New Access Token
↓
Continue normal request flow

For movie data that needs fresh or extended information, the backend can also call the movie provider in parallel:

React Page
↓
Express Route
↓
Controller
↓
Service
↓
movies.provider.js
↓
External Movie API

This means the system has two data sources:

- PostgreSQL as the primary internal data store
- external movie providers for live metadata, current cinema listings, and import tasks

This is the preferred pattern for the project because it separates local application data from external provider access while keeping the frontend and backend aligned through the generated OpenAPI contract.

## 5. Core Modules

### 5.1 Auth Module

Responsible for:

- user registration
- login and logout
- password validation and hashing
- JWT access token generation
- refresh token generation and validation
- refresh token revocation on logout and account deletion
- account deletion flow

Security considerations:

- password hashing with a secure algorithm
- short-lived access tokens for authenticated requests
- long-lived refresh tokens for session renewal
- authentication middleware for protected routes
- ownership checks for user-specific actions
- consistent error handling for invalid credentials and expired tokens

The auth module should include a dedicated token service for:

- generateAccessToken()
- generateRefreshToken()
- verifyAccessToken()
- verifyRefreshToken()
- revokeRefreshToken()

### 5.2 Users Module

Responsible for:

- profile information retrieval
- account management
- user-related access checks
- user-to-group relationship data

This module supports the user identity layer that other modules depend on.

### 5.3 Movies Module

Responsible for:

- movie search by title, genre, year, or filters
- browsing movies currently in Finnish cinemas
- listing movie result cards and detailed data
- importing external movie data into PostgreSQL
- managing local database-first movie data for the application
- using TMDB as the primary external provider for metadata, posters, and live discovery content

The Movies module is intentionally split into distinct responsibilities:

- movies.provider.js: external API access to TMDB, with the option to add Finnkino or other sources later if needed
- movies.import.service.js: import and synchronization logic that stores TMDB data in PostgreSQL
- movies.cache.service.js: short-lived cache for popular or frequently requested live queries to reduce redundant API calls
- movies.service.js: business logic for the application using local database data
- movies.scheduler.js: optional job for scheduled imports or metadata refreshes

This separation keeps the module clean and prevents the service layer from becoming overloaded with both external API logic and internal business logic. The design also supports a hybrid pattern: PostgreSQL remains the operational source for the app, while TMDB remains the primary provider for fresh external content and metadata enrichment.

### 5.4 Groups Module

Responsible for:

- group creation
- group listing
- group detail view
- group deletion by owner
- visibility rules for member-only content

### 5.5 Memberships Module

Responsible for:

- join request creation
- owner approval or rejection
- removing members
- leaving a group
- checking whether a user belongs to a group

This module requires careful permission rules so only owners can manage membership and only valid users can access group-restricted features.

### 5.6 Reviews Module

Responsible for:

- creating movie reviews
- rating movies from 1 to 5 stars
- displaying review list and metadata
- linking reviews to the relevant movie and user

This module should support readable presentation and validation for rating, text, and review submission.

### 5.7 Favorites Module

Responsible for:

- creating personal favorite lists
- adding or removing movies from a list
- rendering favorite list content on the user page
- generating shareable URLs
- viewing shared public favorite lists

This module is closely tied to the user experience and personalized recommendation flow, and it should rely on local PostgreSQL data rather than repeated live calls to the external movie provider.

## 6. Authentication and Authorization

The application should implement a clear authorization model:

- guest users can browse public content and search
- registered users can create reviews and manage favorites
- group owners can approve or reject members and delete groups
- group members can view restricted group content and add movies
- only the authenticated user may delete their own account or manage their own lists

Recommended approach:

- JWT access tokens for authenticated requests
- refresh tokens for session renewal
- authentication middleware for protected routes
- refresh-token revocation on logout and account deletion
- ownership checks before deletion or modification actions
- centralized permission checks in the auth and memberships modules

This authentication design fits the assignment requirement and the expected React + Express + OpenAPI architecture. The access token provides identity for protected requests, while the refresh token allows the client to renew the session without requiring a full login.

## 7. Database Design Principles

The database schema should reflect the domain model clearly:

- users
- groups
- memberships
- movies
- reviews
- favorite_lists
- favorite_list_items
- group_movies
- refresh_tokens

The movie table should distinguish between internal and external identifiers:

- internal primary key for application use
- external provider ID such as a TMDB id
- title, release date, poster URL, and other metadata required by the app
- optional fields to store provider-specific values while keeping the internal schema stable

Example model pattern:

- id: internal application ID
- tmdbId: TMDB external identifier
- title: movie title
- overview: summary
- releaseDate: date
- posterPath: poster URL or path
- backdropPath: backdrop URL or path

This design keeps internal application records clean while preserving explicit linkage to the provider data source.

The refresh_tokens table should hold:

- token value
- associated user ID
- expiry timestamp
- optional revocation state

Relationships should be normalized enough to support:

- many users to many groups
- many reviews per movie and user
- many favorite lists per user
- many movies per group page and favorite list
- one owner per group and multiple members per group
- reuse of the same movie entity across reviews, favorites, and groups
- one-to-many refresh tokens per user for controlled session renewal and revocation

This design allows the application to store and reuse imported movie data in PostgreSQL while still being able to match it to live external records when needed.

## 8. API Design Principles

The backend API should be consistent and predictable:

- clear REST-style endpoints
- consistent naming conventions
- structured JSON responses
- standard error payloads
- validation before business logic execution
- OpenAPI/Swagger as the contract-first API definition
- generated client usage on the frontend wherever possible
- Swagger UI for interactive testing and backend contract review
- authentication and authorization explicitly declared in the OpenAPI schema

Examples of route groups:

- /auth/register
- /auth/login
- /auth/logout
- /auth/refresh
- /users
- /movies
- /groups
- /memberships
- /reviews
- /favorites

Protected routes should declare bearer-token security in the OpenAPI specification so that the frontend and backend use the same contract for JWT-based authorization. Swagger UI should be available for interactive API inspection and manual validation, while the generated client keeps frontend calls aligned with the backend contract.

## 9. Testing and Quality Strategy

The project should include automated testing as part of the technical architecture, not just as a project management task.

Recommended testing approach:

- Jest for backend unit and integration testing
- Supertest for testing Express routes and API responses
- real HTTP request testing against the app rather than isolated mock-only assertions
- coverage for authentication flows, authorization checks, movie browsing, reviews, and validation errors
- automated verification of access-token and refresh-token behavior
- API contract validation against the OpenAPI specification and actual route behavior
- CI execution with the project test command before deployment

This ensures that the API contract, JWT logic, and business rules are validated as the backend evolves. The tests should validate real behavior, including success and failure paths, rather than only checking whether mocked handlers were called.

## 10. Frontend Design Principles

The frontend should prioritize:

- responsive layout across desktop and mobile screens
- clear page structure for movie search, groups, reviews, and user pages
- reusable UI components where possible
- shared hooks for auth, movie data, and group state
- graceful empty states and error messages
- user-friendly navigation between home, groups, favorites, and reviews

## 11. Deployment and Environment Setup

The project is intended for a modern full-stack deployment and should support:

- local development environment
- PostgreSQL local database or containerized database
- Azure App Service for backend deployment
- Azure Database for PostgreSQL for runtime storage
- GitHub Actions CI/CD pipeline for automated validation and deployment
- backend environment configuration through environment variables
- frontend API base URL configuration
- production-ready environment separation
- optional import or sync jobs for movie datasets during deployment or as scheduled tasks

## 12. Risks and Constraints

### 11.1 Scope Risk

The project includes many features, so sprint planning and backlog splitting are important. The board should keep each PBI small and testable.

### 11.2 Data Consistency Risk

Group membership, reviews, and favorite list operations require careful transactional handling to prevent invalid or inconsistent state.

### 11.3 External Data Dependency

Movie data will use a hybrid approach. The system imports external data into PostgreSQL for internal use, while selected functionality still calls an external provider at runtime when fresh or extended movie data is needed. TMDB is the primary provider for this external data layer because it matches the project’s movie discovery, metadata, poster, and trending requirements and exposes a mature API and OpenAPI documentation.

### 11.4 CI/CD and Deployment Risk

Deployment must account for database migration, dataset import, and environment configuration in GitHub Actions before the application is considered ready for Azure App Service.

### 11.5 Security Risk

Authentication, authorization, and protected content access must be designed early because they affect most user-facing features.

## 13. Recommended Development Order

A practical implementation order could be:

1. Auth and user account management
2. Database schema and Prisma models for core entities
3. Movie provider integration and dataset import flow
4. Movie search and cinema listing using local PostgreSQL data
5. Group creation and visibility rules
6. Membership request and approval flow
7. Group movie content management
8. Reviews and rating flow
9. Favorite list creation and sharing
10. GitHub Actions and Azure deployment setup
11. UI polish and responsive refinements
12. Final validation and bug fixing

This sequence aligns with the current backlog and keeps the project manageable for a four-student team while supporting the deployment flow required for Azure.

## 14. External Integration Section

The application should explicitly support a hybrid movie-data model:

TMDB API
├── Dataset Import
├── Movie Search
├── Movie Details
├── Trending and Popular Lists
├── Genre and Metadata Lookup
├── Cache Layer
└── Metadata Refresh

This provider layer is separate from the application’s internal logic and is used to:

- import core movie data into the PostgreSQL database
- keep the app’s internal movie records fresh enough for the product
- support specific live queries that require current external data
- reduce repeated third-party calls with a lightweight cache layer

The rest of the system should use PostgreSQL first for reviews, favorites, groups, memberships, and general app behavior. This keeps performance stable, reduces third-party reliance, and supports the Azure deployment model. TMDB is the preferred provider because it matches the project’s movie discovery and metadata needs and provides OpenAPI documentation that supports a clean API contract and future client generation.

## 14. Conclusion

The architecture is well suited to a layered, full-stack React + Express + Prisma + PostgreSQL application with a hybrid external movie-data strategy. The module-based structure is a strong fit for the project because it mirrors the actual feature domains: auth, users, movies, groups, memberships, reviews, and favorites.

TMDB is the recommended primary movie provider, with PostgreSQL acting as the internal source of truth and a cache layer used for repeated live requests. The OpenAPI client remains part of the contract-first workflow, while the backend stays organized by domain modules and shared middleware. The key architectural improvement is the explicit separation between local PostgreSQL data and external movie-provider access, which is essential for the project’s CI/CD and Azure deployment plan.
