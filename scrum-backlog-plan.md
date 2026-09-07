# Scrum Backlog Plan for the Movie Project

This backlog is based on the official solution requirements and is structured for Azure DevOps Scrum use. The format is intentionally board-friendly so each item can be moved into a backlog, sprint, or work item with minimal editing.

## Product Goal

As a user, I want to browse movies, search the catalog, join groups, share favorite lists, and add reviews through a responsive web application built with React, Node.js, and PostgreSQL.

> Note: "Epic N" and "PBI N" labels in this plan are this document's own reference numbers for tracking and cross-referencing, not the actual Azure DevOps work item IDs. Azure DevOps assigns its own sequential ID to every work item you create (regardless of type), so a PBI documented here as "PBI 1" might be created as, e.g., ADO ID 37. When creating a board item from this plan, put the plan's label (e.g. "PBI 1") in the work item title or description for traceability, and note the resulting ADO ID here if useful.

> Azure DevOps IDs (created 2026-09-04): Epic 1-12 = ADO 46-57 (in order). PBI 1=58, 2=73, 3=74, 4=75, 5=79, 6=80, 7=66, 8=67, 9=81, 10=82, 11=83, 12=84, 13=77, 14=78, 15=62, 16=63, 17=64, 18=65, 19=59, 20=60, 21=61, 22=68, 23=69, 24=70, 25=71, 26=72, 27=76. Tasks under PBI 1 (ADO 58) = ADO 85-91, in the same order as the task breakdown below. Sprint 1-6 iterations exist in Azure Boards and are assigned to "Elokuvaprojekti Team", with dates matching weeks 36-41.

> Task creation status: every PBI below now has a concrete task breakdown written in this document. In Azure Boards, Task work items have been created for Sprint 1-2 PBIs only (1, 2, 3, 4, 5, 19, 20, 22, 23) since their concrete steps are stable now. Tasks for Sprint 3-6 PBIs (6-18, 21, 24, 27) are intentionally **not yet created in Azure Boards** - create them from this document's task breakdown just before each of those sprints starts, since their exact steps may shift depending on what gets built in Sprint 1-2 (e.g. exact Prisma schema, auth middleware shape). PBI 25 and 26 are continuous and can be created whenever convenient.

---

## Definition of Done

Testing and API documentation are ongoing work, not a single task done once at the end. Every feature PBI below (any PBI that adds or changes an API endpoint) is only "done" in its own sprint when:

- The endpoint(s) are added/updated in backend/swagger/openapi.yaml (path, request/response schema, status codes, auth requirement).
- At least one Jest/Supertest test exists for the new endpoint (one happy-path case, one failure case).
- The code passes lint and the GitHub Actions CI workflow.
- The PR has been reviewed before merging to main (see GitHub Integration section).

Each feature PBI's task breakdown below ends with a task line pointing back to this section. PBI 19-21 (test suites) and PBI 24 (Swagger) still exist in the backlog, but as periodic hardening/consolidation passes (broader integration tests, a final documentation polish before submission) - not as the only place testing or docs happen.

---

## Definition of Ready

A PBI should only be pulled into a sprint (moved to "To Do"/started) once:

- Its acceptance criteria (below) are clear and understood by whoever picks it up.
- Its task breakdown exists in this document (all PBIs already have one).
- Its Predecessor PBIs (see Azure Boards work item links) are done, or close enough to done that this PBI isn't blocked.
- It has an Effort estimate and fits in the remaining sprint capacity for whoever is picking it up.

If a PBI doesn't meet these, raise it in the next sprint planning/stand-up before starting it, rather than starting and getting blocked mid-sprint.

---

## Sprint Goals

Short, one-line goal per sprint, for reference when filling in the "Sprint Goal" field on each iteration in Azure Boards (Boards -> Sprints -> select sprint -> Sprint Goal):

- **Sprint 1:** Backend and frontend scaffolding run end-to-end (CI green, Prisma connected), users can register, the test runner is operational, and the UI plan is documented.
- **Sprint 2:** Users can log in, log out, and delete their account; movies can be searched with multiple criteria and browsed as now-in-cinemas; the class diagram is complete; the authentication flow is covered by automated tests.
- **Sprint 3:** Users can create, view, and delete groups, and request/approve/reject group membership.
- **Sprint 4:** Members can leave or be removed from a group, add movies to a group page, create reviews, and browse reviews.
- **Sprint 5:** Users can create, share, and view favorite lists; the UI is responsive; review browsing is covered by automated tests.
- **Sprint 6:** OpenAPI docs are finalized, the optional feature (if in scope) is implemented, and the project is submission-ready.

---

## Epic 1: Technical Foundation

### PBI 1: Project foundation and environment setup

Title: Project foundation and environment setup

User story:

As a developer, I want the backend and frontend project scaffolding, environment configuration, and base tooling in place so that feature work can start on a stable foundation.

Mapped requirement: Technical enabler (not mapped to a graded requirement ID; required for Phase 1 of implementation-plan.md)

Acceptance criteria:

- Backend and frontend project structures are initialized.
- Environment variables and sample config are defined.
- Prisma connection and local PostgreSQL database are set up.
- Core Express app bootstrap, validation, and error-handling middleware are in place.
- OpenAPI base definition and generation flow are created.
- Basic GitHub Actions workflow runs install, lint, and test checks.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Init backend project structure

Create the backend/ folder as its own Node.js project.

- Run `npm init -y` inside backend/
- Install core deps: express, prisma, @prisma/client, dotenv, cors
- Install dev deps: nodemon, eslint
- Create the folder skeleton from architecture-plan.md section 3.2: modules/, middleware/, prisma/, swagger/, config/, app.js, server.js
- Add a `start`/`dev` script in package.json (nodemon server.js)

#### Init frontend project structure

Create the frontend/ folder using Vite + React (`npm create vite@latest frontend -- --template react`).

- Install dependencies and confirm `npm run dev` starts a blank page
- Create the folder skeleton from architecture-plan.md section 3.1: pages/, components/, hooks/, context/, layouts/, services/
- Add a placeholder Navbar component and HomePage so the structure is visible, not empty folders

#### Define environment variables / sample config

Create backend/.env (gitignored) and backend/.env.example (committed) with placeholders for:

- DATABASE_URL (PostgreSQL connection string)
- JWT_SECRET / JWT_REFRESH_SECRET
- TMDB_API_KEY
- PORT

Create frontend/.env.example with VITE_API_BASE_URL. Document in README.md (or a short SETUP.md) how to copy .env.example to .env and fill it in.

#### Set up Prisma connection + local PostgreSQL

- Install PostgreSQL locally (or via Docker: `docker run --name movie-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`)
- Run `npx prisma init` in backend/ to generate prisma/schema.prisma
- Point DATABASE_URL in .env to the local database
- Add a minimal test model (e.g. User) and run `npx prisma migrate dev --name init` to confirm the connection works end-to-end

#### Express app bootstrap + validation/error-handling middleware

- Create backend/app.js: set up express(), cors(), express.json()
- Create backend/server.js: import app.js and start listening on process.env.PORT
- Add backend/middleware/errorHandler.js: a single Express error-handling middleware that returns a consistent JSON error shape (`{ error: { message, code } }`)
- Add backend/middleware/validation.js: a small wrapper to validate request bodies (can use a library like zod or express-validator)
- Wire both middlewares into app.js

#### Create OpenAPI base definition and generation flow

- Install swagger-ui-express and either swagger-jsdoc or write openapi.yaml by hand
- Create backend/swagger/openapi.yaml with just the base info block (title, version, servers) and an empty `paths: {}` to start
- Create backend/swagger/swagger.js that loads the YAML and mounts Swagger UI at /api-docs
- Confirm `http://localhost:<port>/api-docs` loads in the browser (even with no endpoints documented yet)

#### Set up GitHub Actions (install, lint, test)

- Add .github/workflows/ci.yml
- Steps: checkout code, setup Node, run `npm ci` in backend/ and frontend/, run `npm run lint` in both, run `npm test` in backend/ (even if there are 0 tests yet, the script should exist and exit 0)
- Confirm the workflow shows green on a test push/PR

---

## Epic 2: User Management

### PBI 2: Registration

Title: Registration

User story:

As a new user, I want to create an account so that I can access personalized features on the platform.

Mapped requirement: ID 2 - Registration

Acceptance criteria:

- User can register with an email address.
- Password is at least 8 characters long.
- Password contains at least one uppercase letter.
- Password contains at least one number.
- Account is created successfully and stored in the system.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement registration

- Add a User model to prisma/schema.prisma (id, email, passwordHash, createdAt) and run `npx prisma migrate dev`
- Create backend/modules/auth/auth.validation.js: check email format and password rules (>=8 chars, 1 uppercase, 1 number)
- Create backend/modules/auth/auth.service.js: hash the password with bcrypt and create the user record
- Create backend/modules/auth/auth.controller.js and auth.routes.js: add POST /auth/register
- Wire auth.routes.js into app.js
- Add a RegisterPage.jsx form in frontend calling an authApi.js service that posts to /auth/register
- Test registration with valid and invalid data via Swagger UI (/api-docs)
- [DoD] Add the /auth/register entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

### PBI 3: Login and logout

Title: Login and logout

User story:

As a registered user, I want to log in and log out so that I can access my account securely and end the session when needed.

Mapped requirement: ID 3 - Login

Acceptance criteria:

- User can log in with a valid email and password.
- Invalid credentials show an error message.
- Successful login creates a valid user session.
- User can log out from the application.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement login/logout

- Add a RefreshToken model to prisma/schema.prisma and run `npx prisma migrate dev`
- Create backend/modules/auth/token.service.js: generateAccessToken(), generateRefreshToken(), verifyAccessToken(), verifyRefreshToken(), revokeRefreshToken()
- Add POST /auth/login: verify email + password with bcrypt.compare, issue access and refresh tokens
- Add POST /auth/logout: revoke the refresh token
- Add backend/modules/auth/auth.middleware.js to verify the access token on protected routes
- Add LoginPage.jsx and context/AuthContext.jsx in frontend to store tokens and expose login()/logout()
- Test login with valid and invalid credentials via Swagger UI
- [DoD] Add the /auth/login and /auth/logout entries to openapi.yaml and write Jest/Supertest tests for both (see Definition of Done)

### PBI 4: Delete account and remove created data

Title: Delete account and remove created data

User story:

As a user, I want to delete my account so that I can permanently leave the service and remove my created data.

Mapped requirement: ID 4 - Account deletion

Acceptance criteria:

- User can delete their own account.
- User-created reviews are removed.
- User-created favorite lists are removed.
- Related user-generated data is removed according to the requirement.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement account deletion

- Add DELETE /users/me endpoint in a users module, protected by the auth middleware
- In users.service.js, delete related reviews, favorite lists, and memberships (or set `onDelete: Cascade` in Prisma relations) before deleting the user record
- Revoke all refresh tokens belonging to the user on deletion
- Add a "Delete account" button with a confirmation dialog on UserProfilePage
- Test that deletion removes the user, their reviews, and their favorite lists from the database
- [DoD] Add the DELETE /users/me entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

---

## Epic 3: Movie Discovery and Search

### PBI 5: Search movies and series using multiple criteria

Title: Search movies and series using multiple criteria

User story:

As a visitor, I want to search for movies and series using multiple search criteria so that I can quickly find relevant content.

Mapped requirement: ID 5 - Search

Acceptance criteria:

- Search works without login.
- At least 3 different search criteria or filters are supported.
- Search results are shown clearly.
- No-match state is handled properly.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement movie search

- Create backend/modules/movies/movies.provider.js: a TMDB search wrapper supporting title, genre, and year filters
- Add GET /movies/search in movies.routes.js accepting query params for at least 3 criteria
- Implement movies.service.js: map the TMDB response to a simplified movie card shape
- Handle the no-match case by returning an empty array, not an error
- Create frontend MovieSearchPage.jsx with a search form and a MovieCard list
- Add services/movieApi.js in frontend calling /movies/search
- Test search with a valid query, an empty query, and a no-match query
- [DoD] Add the GET /movies/search entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

### PBI 6: View movies currently in Finnish cinemas

Title: View movies currently in Finnish cinemas

User story:

As a visitor, I want to see movies that are currently showing in Finnish cinemas so that I can discover what is available to watch.

Mapped requirement: ID 6 - Now in cinemas

Acceptance criteria:

- Feature is available without login.
- Movies currently in Finnish cinemas are displayed.
- The list is visible and easy to browse.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement now-in-cinemas listing

- Look up TMDB's "now playing" endpoint and confirm it can be filtered/queried for the Finland region
- Add a getNowPlayingFinland() function to movies.provider.js
- Add GET /movies/now-playing (public, no auth) in movies.routes.js
- Add a short-TTL cache in movies.cache.service.js so repeated requests don't hit TMDB every time
- Add a "Now in cinemas" section/page in frontend reusing the MovieCard component
- Test that the endpoint returns current Finnish cinema listings
- [DoD] Add the GET /movies/now-playing entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

---

## Epic 4: Group Management

### PBI 7: Create and view groups

Title: Create and view groups

User story:

As a user, I want to create a group and view the list of existing groups so that I can join and participate in communities around shared movie interests.

Mapped requirement: ID 7 - Group page

Acceptance criteria:

- User can create a new group with a chosen name.
- New groups appear in the group list.
- User can open a group detail page.
- Group list is visible to all users.
- Detailed group content is visible only to group members.
- Group owner can delete the group.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement group creation and listing

- Add a Group model to prisma/schema.prisma (id, name, ownerId, createdAt) and run `npx prisma migrate dev`
- Create backend/modules/groups/ (groups.routes.js, groups.controller.js, groups.service.js, groups.validation.js)
- Add POST /groups (protected, create) and GET /groups (public, list)
- Add GET /groups/:id with a membership-based visibility check for detailed content
- Add a GroupPage list view plus a "Create group" form in frontend
- Add services/groupApi.js in frontend
- Test group creation and that only members can see the detailed group content
- [DoD] Add the POST/GET /groups entries to openapi.yaml and write Jest/Supertest tests for them (see Definition of Done)

### PBI 8: Delete a group

Title: Delete a group

User story:

As a group owner, I want to delete my group so that I can remove it when it is no longer needed.

Mapped requirement: ID 7 - Group page

Acceptance criteria:

- Group owner can delete the group they created.
- Group is removed from the list after deletion.
- Group data no longer appears to users.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement group deletion

- Add DELETE /groups/:id in groups.routes.js, restricted to the group owner
- Add an ownership check in groups.service.js (compare req.user.id to group.ownerId)
- Clean up or cascade-delete related memberships and group_movies records on deletion
- Add a "Delete group" button visible only to the owner in the frontend
- Test deletion succeeds for the owner and is rejected with 403 for non-owners
- [DoD] Add the DELETE /groups/:id entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

---

## Epic 5: Group Membership

### PBI 9: Request to join a group

Title: Request to join a group

User story:

As a user, I want to send a request to join a group so that I can become a member when approved.

Mapped requirement: ID 8 - Add member

Acceptance criteria:

- User can send a join request to a group.
- Request is visible to the group owner.
- Owner can approve or reject the request.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement join requests

- Add a Membership model to prisma/schema.prisma (userId, groupId, status: pending/approved/rejected) and run `npx prisma migrate dev`
- Create backend/modules/memberships/ (memberships.routes.js, memberships.controller.js, memberships.service.js, memberships.validation.js)
- Add POST /groups/:id/join-requests (protected)
- Add GET /groups/:id/join-requests for the owner to view pending requests
- Add a "Request to join" button on the group list/detail page in frontend
- Test that duplicate join requests are handled sensibly (e.g. rejected or no-op)
- [DoD] Add the POST/GET /groups/:id/join-requests entries to openapi.yaml and write Jest/Supertest tests for them (see Definition of Done)

### PBI 10: Approve or reject join requests

Title: Approve or reject join requests

User story:

As a group owner, I want to approve or reject membership requests so that I can control who joins my group.

Mapped requirement: ID 8 - Add member

Acceptance criteria:

- Owner can approve a join request.
- Owner can reject a join request.
- Approved members gain access to group content.
- Rejected users do not become group members.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement approve/reject

- Add PATCH /groups/:id/join-requests/:requestId (approve/reject), owner-only
- Update the membership status in memberships.service.js
- Ensure approved members immediately gain access to group-restricted content (recheck used by GET /groups/:id)
- Add an owner-only "Pending requests" list with approve/reject buttons in frontend
- Test that approve and reject flows change membership state correctly
- [DoD] Add the PATCH /groups/:id/join-requests/:requestId entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

### PBI 11: Remove a group member or leave a group

Title: Remove a group member or leave a group

User story:

As a group owner or member, I want to manage group membership so that I can remove users or leave the group when necessary.

Mapped requirement: ID 9 - Remove member

Acceptance criteria:

- Group owner can remove a member.
- A member can leave the group themselves.
- Membership updates are reflected immediately.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement remove/leave

- Add DELETE /groups/:id/members/:userId for owner-initiated removal
- Add DELETE /groups/:id/members/me for self-initiated leave
- Add permission checks: only the owner can remove others; any member can leave themselves
- Add "Remove" (owner) and "Leave group" (member) actions to the group member list in frontend
- Test that removal and leaving update the member list immediately
- [DoD] Add the DELETE /groups/:id/members/:userId and /members/me entries to openapi.yaml and write Jest/Supertest tests for them (see Definition of Done)

---

## Epic 6: Group Page Content

### PBI 12: Add a movie to a group page

Title: Add a movie to a group page

User story:

As a group member, I want to add a searched movie to the group page so that I can share recommendations with the group.

Mapped requirement: ID 10 - Group page customization

Acceptance criteria:

- Group member can search for a movie.
- Selected movie can be added to the group page.
- Added movie is visible on the group page.
- Only group members can add movies to the group content.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement group page movies

- Add a GroupMovie model to prisma/schema.prisma (groupId, movieId, addedByUserId) and run `npx prisma migrate dev`
- Add POST /groups/:id/movies (protected, membership required), reusing the membership check from the memberships module
- Add GET /groups/:id/movies to list movies added to the group page
- Add a movie search + "Add to group" action on the GroupPage, reusing MovieSearchPage components
- Test that only members can add movies and non-members are rejected
- [DoD] Add the POST/GET /groups/:id/movies entries to openapi.yaml and write Jest/Supertest tests for them (see Definition of Done)

---

## Epic 7: Movie Reviews

### PBI 13: Create a movie review

Title: Create a movie review

User story:

As a logged-in user, I want to review a movie so that I can share my opinion with other users.

Mapped requirement: ID 11 - Movie review

Acceptance criteria:

- User must be logged in to create a review.
- Review contains text.
- Review contains a rating from 1 to 5 stars.
- Reviewer username is displayed.
- Review timestamp is displayed.
- Review is shown with the movie details.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement review creation

- Add a Review model to prisma/schema.prisma (id, userId, movieId, rating 1-5, text, createdAt) and run `npx prisma migrate dev`
- Create backend/modules/reviews/ (reviews.routes.js, reviews.controller.js, reviews.service.js, reviews.validation.js)
- Add POST /movies/:id/reviews (protected); validate rating range (1-5) and non-empty text
- Wire reviews.validation.js into the route
- Add a review form component on the movie detail page in frontend
- Test that review creation requires login and validates rating/text
- [DoD] Add the POST /movies/:id/reviews entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

### PBI 14: Browse movie reviews

Title: Browse movie reviews

User story:

As a visitor, I want to view movie reviews so that I can evaluate movies before watching them.

Mapped requirement: ID 12 - Review browsing

Acceptance criteria:

- Reviews are visible to all users.
- Reviews are displayed with the relevant movie.
- Review metadata is readable and visible.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement review browsing

- Add GET /movies/:id/reviews (public, no auth)
- Join with the users table so the response includes username and a formatted timestamp
- Add a ReviewList component in frontend showing reviews under movie details
- Handle the empty state (no reviews yet) in both the API response and the UI
- Test that review browsing works without login and displays correct metadata
- [DoD] Add the GET /movies/:id/reviews entry to openapi.yaml (see Definition of Done; this endpoint's dedicated test suite is PBI 21)

---

## Epic 8: Favorite Lists and Sharing

### PBI 15: Create favorite list

Title: Create favorite list

User story:

As a logged-in user, I want to create my own favorite movie list so that I can save and display movies I like.

Mapped requirement: ID 13 - Favorite list

Acceptance criteria:

- User can create a favorite list.
- Favorite list is displayed on the user page.
- User can manage the movies in the list.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement favorite lists

- Add FavoriteList and FavoriteListItem models to prisma/schema.prisma and run `npx prisma migrate dev`
- Create backend/modules/favorites/ (favorites.routes.js, favorites.controller.js, favorites.service.js, favorites.validation.js)
- Add POST /favorites (create list) and POST /favorites/:id/items (add movie), both protected
- Add DELETE /favorites/:id/items/:movieId to remove a movie from the list
- Add a FavoriteListPage in frontend showing the user's list with add/remove actions
- Test list creation and item management end-to-end
- [DoD] Add the /favorites entries to openapi.yaml and write Jest/Supertest tests for them (see Definition of Done)

### PBI 16: Share favorite list via URL

Title: Share favorite list via URL

User story:

As a logged-in user, I want to share my favorite list using a URL so that other users can access it directly.

Mapped requirement: ID 14 - Share favorite list

Acceptance criteria:

- User can generate a shareable URL for the favorite list.
- URL is visible to other users.
- A share button or equivalent action is available in the UI.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement list sharing

- Add a shareToken (e.g. UUID) field to FavoriteList in prisma/schema.prisma and run `npx prisma migrate dev`
- Add GET /favorites/:shareToken/public (no auth) returning the list by token
- Generate the shareable URL as `${FRONTEND_URL}/lists/:shareToken` in favorites.service.js
- Add a "Share" button in FavoriteListPage that copies the URL to the clipboard
- Test that the generated URL resolves to the correct list
- [DoD] Add the GET /favorites/:shareToken/public entry to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

### PBI 17: View shared favorite lists

Title: View shared favorite lists

User story:

As a user, I want to view other users' shared favorite lists so that I can discover recommendations.

Mapped requirement: ID 14 - Share favorite list

Acceptance criteria:

- Shared list page is accessible via URL.
- Other users can view the public list content.
- The page shows the list and associated movies.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement shared list viewing

- Create frontend SharedListPage.jsx that reads :shareToken from the route and calls the public favorites endpoint
- Add a /lists/:shareToken route in the frontend router
- Reuse the MovieCard component to render the shared list's movies
- Handle invalid/unknown share tokens with a clear "not found" state
- Test viewing a shared list as a logged-out visitor
- [DoD] Confirm this endpoint's Swagger entry is covered by PBI 16's entry (see Definition of Done)

---

## Epic 9: User Interface

### PBI 18: Responsive user interface

Title: Responsive user interface

User story:

As a user, I want the application to work well on different screen sizes so that I can use it comfortably on desktop and mobile devices.

Mapped requirement: ID 1 - Responsiveness

Acceptance criteria:

- Layout adapts to different screen sizes.
- Content remains readable on smaller screens.
- Core features remain usable on supported screen sizes.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement responsive layout

- Choose and document a breakpoint strategy (e.g. mobile <640px, tablet <1024px, desktop >=1024px)
- Audit MainLayout, Navbar, and page grids for responsiveness; add CSS/flex/grid fixes
- Add a mobile navigation pattern (e.g. hamburger menu) to Navbar
- Test MovieSearchPage, GroupPage, and FavoriteListPage layouts at mobile/tablet/desktop widths
- Fix any overflow, text-truncation, or touch-target issues found during testing

---

## Epic 10: Testing and Quality Assurance

### PBI 19: Set up Jest and Supertest for API testing

Title: Set up Jest and Supertest for API testing

User story:

As a developer, I want automated API tests set up so that the project can validate backend behavior consistently.

Mapped requirement: automated REST testing requirement

Acceptance criteria:

- Jest is configured for the project.
- Supertest is configured for API testing.
- Test runner is ready for backend validation.
- Tests can be executed via the project workflow.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Set up the test runner

- Install jest and supertest as dev dependencies in backend/
- Add a `"test": "jest"` script to backend/package.json
- Create a backend/tests/ folder and a first smoke test (e.g. GET /api-docs returns 200)
- Configure a separate test database or use a Prisma test-transaction pattern to avoid polluting dev data
- Confirm `npm test` runs and passes locally and in the GitHub Actions CI workflow

### PBI 20: Test authentication flow

Title: Test authentication flow

User story:

As a developer, I want the authentication endpoints tested so that login, logout, registration, and account deletion behave correctly.

Mapped requirement: API testing requirement for login, logout, registration, and account deletion

Acceptance criteria:

- Positive login flow is tested.
- Negative login flow is tested.
- Registration flow is tested.
- Logout flow is tested.
- Account deletion flow is tested.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Write auth test suites

- Write backend/tests/auth.register.test.js: valid registration (201) and invalid password/email (400)
- Write backend/tests/auth.login.test.js: valid login (200 + tokens) and invalid credentials (401)
- Write backend/tests/auth.logout.test.js: logout invalidates the refresh token
- Write backend/tests/auth.delete.test.js: authenticated account deletion removes the user
- Run all four suites via `npm test` and fix any failures

### PBI 21: Test review browsing endpoint

Title: Test review browsing endpoint

User story:

As a developer, I want review browsing tested so that public movie reviews are returned correctly and invalid cases are handled.

Mapped requirement: API testing requirement for review browsing

Acceptance criteria:

- Successful review retrieval is tested.
- Empty or invalid review scenarios are handled.
- Response structure matches expected API behavior.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Write review browsing test suite

- Write backend/tests/reviews.browse.test.js: GET /movies/:id/reviews returns reviews with the expected shape
- Add a test case for a movie with zero reviews (empty array, not an error)
- Add a test case for an invalid/non-existent movie id (404 or empty result, per the API contract)
- Verify the response includes username and timestamp fields
- Run the suite via `npm test` and fix any failures

---

## Epic 11: Documentation and Project Management

### PBI 22: Create database class diagram

Title: Create database class diagram

User story:

As a project team, we need a database class diagram so that the relational model is documented and shared.

Mapped requirement: database class diagram documentation

Acceptance criteria:

- Entity relationships are represented clearly.
- Core tables and relations are documented.
- Diagram is available for team review.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Produce the class diagram

- List all Prisma models needed across modules (User, Group, Membership, Movie, Review, FavoriteList, FavoriteListItem, GroupMovie, RefreshToken)
- Draw the diagram using Mermaid `classDiagram` syntax showing relationships and cardinalities
- Update docs/class-diagram.md with the diagram
- Cross-check the diagram against backend/prisma/schema.prisma once modules are implemented
- Get a quick team review before submission

### PBI 23: Create user interface plan

Title: Create user interface plan

User story:

As a project team, we need a UI plan so that the frontend structure and screens are aligned before implementation.

Mapped requirement: user interface design documentation

Acceptance criteria:

- Main screens are listed.
- Navigation structure is described.
- Core UI components are identified.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Produce the UI plan

- List the core pages/screens: Home, Login, Register, Movie Search, Movie Detail, Group List, Group Detail, User Profile, Favorite List, Shared List
- Sketch a simple wireframe per page (paper, Figma, or Excalidraw - low fidelity is fine)
- Document the navigation flow (which pages link to which) as a short diagram or list
- Identify shared components (Navbar, MovieCard, ReviewList, GroupList, FavoriteListCard) referencing architecture-plan.md section 3.1
- Save the plan as a markdown file or image set in docs/

### PBI 24: Create OpenAPI/Swagger REST API documentation

Title: Create OpenAPI/Swagger REST API documentation

User story:

As a developer, I want the backend API documented with OpenAPI and Swagger so that the frontend and backend use the same contract and the API can be tested interactively.

Mapped requirement: REST documentation and API contract documentation

Acceptance criteria:

- OpenAPI specification is defined for the backend.
- Swagger UI is available for viewing and testing endpoints.
- API endpoints, request and response structures, and auth requirements are documented.
- The generated contract reflects the implemented API.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Finalize API documentation

- Add path/schema definitions to backend/swagger/openapi.yaml for every implemented endpoint (auth, movies, groups, memberships, reviews, favorites)
- Document request/response bodies and status codes for each endpoint
- Document auth requirements (bearer token) using an OpenAPI security scheme
- Verify Swagger UI at /api-docs renders all endpoints correctly and matches actual behavior
- Do a final pass comparing the spec against the implemented API right before submission

### PBI 25: Manage project backlog and version control

Title: Manage project backlog and version control

User story:

As a project team, we want backlog management and version control practices in place so that work is visible, traceable, and delivered in a controlled way.

Mapped requirement: backlog management and version control

Acceptance criteria:

- backlog is maintained and updated regularly
- version control is used consistently
- commits and branches are managed in a standard way

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps; ongoing across Sprints 1-6):

#### Maintain backlog and version control discipline

- Review and update scrum-backlog-plan.md and the Azure Boards board at the start and end of each sprint
- Follow the branch naming and `AB#<id>` commit convention from the GitHub Integration section for every PR
- Move work items across board columns (New/Active/Resolved/Closed) as work progresses
- Do a short backlog grooming pass before each sprint planning session
- Keep main protected; merge only via reviewed pull requests

### PBI 26: Coordinate project execution and delivery

Title: Coordinate project execution and delivery

User story:

As a project team, we want clear responsibilities and schedule tracking so that we deliver the project on time and in a collaborative way.

Mapped requirement: project management and cooperation

Acceptance criteria:

- tasks are assigned clearly
- delivery dates and sprint goals are tracked
- team communication and responsibility sharing are in place
- progress is reviewed regularly

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps; ongoing across Sprints 1-6):

#### Coordinate delivery

- Hold a short sprint planning session at the start of each sprint, assigning PBIs/tasks per the Slice A-D split in implementation-plan.md section 11
- Hold a brief mid-sprint check-in to surface blockers early
- Hold a sprint review/retro at the end of each sprint against the sprint's acceptance criteria
- Assign each in-progress work item to yourself in Azure Boards when you start it
- Flag schedule risks against the week 36-41 calendar as soon as they appear

---

## Epic 12: Optional Feature

### PBI 27: Implement a free-choice optional feature

Title: Implement a free-choice optional feature

User story:

As a user, I want an additional self-chosen feature so that the application offers something beyond the required scope.

Mapped requirement: ID 15 - Optional feature (1 point, stretch scope)

Acceptance criteria:

- Feature is scoped and agreed on by the team.
- Feature does not block or delay core/required scope (implemented only after MVP and required scope are stable, per implementation-plan.md section 9).
- Feature is functional and demoable.
- Feature is documented briefly in the README or docs.

Task breakdown (for reference when creating Tasks under this PBI in Azure DevOps):

#### Implement the optional feature

- Team decides and writes down the chosen optional feature and its scope (keep it small)
- Confirm the feature doesn't require changes to already-shipped PBIs' schemas or contracts
- Implement the feature using the existing module pattern (routes/controller/service/validation)
- Add minimal tests or manual verification steps for the feature
- Document the feature briefly in README.md
- [DoD] If the feature adds an endpoint, add it to openapi.yaml and write a Jest/Supertest test for it (see Definition of Done)

---

## GitHub Integration

Code for this project lives in the GitHub repository `tommiLipponen/Elokuvaprojekti` (default branch `main`). To keep Azure Boards and GitHub in sync:

- Branch naming: `feature/pbi-<n>-short-description` (e.g. `feature/pbi-5-movie-search`), created from `main`.
- Reference the Azure DevOps work item ID in commit messages and pull request titles/descriptions using `AB#<id>` (e.g. `AB#42`) so GitHub commits/PRs auto-link to the work item and the work item shows linked commits/PRs.
- Open a PR into `main` per PBI (or per task, for larger PBIs); do not push directly to `main`.
- Keep PBI/Task state in Azure Boards updated as PRs move through review and merge (e.g. move to "Done" once the PR is merged and acceptance criteria are verified).

## Sprint Recommendation

> Note: These six sprints match the weekly sprint calendar (weeks 36-41) defined in implementation-plan.md, so both documents describe the same schedule.

### Sprint 1 (Week 36): Foundation and identity groundwork

- PBI 1: Project foundation and environment setup
- PBI 19: Set up Jest and Supertest for API testing
- PBI 2: Registration
- PBI 23: Create user interface plan (drafted before frontend work begins)

### Sprint 2 (Week 37): Auth complete, movie search begins

- PBI 3: Login and logout
- PBI 4: Delete account and remove created data
- PBI 20: Test authentication flow
- PBI 5: Search movies and series using multiple criteria
- PBI 22: Create database class diagram (drafted once auth and movie schema exist)

### Sprint 3 (Week 38): Movie domain complete, group groundwork

- PBI 6: View movies currently in Finnish cinemas
- PBI 7: Create and view groups
- PBI 8: Delete a group

### Sprint 4 (Week 39): Group and membership complete, reviews begin (MVP milestone)

- PBI 9: Request to join a group
- PBI 10: Approve or reject join requests
- PBI 11: Remove a group member or leave a group
- PBI 12: Add a movie to a group page
- PBI 13: Create a movie review
- PBI 14: Browse movie reviews
- PBI 21: Test review browsing endpoint

### Sprint 5 (Week 40): Favorites, sharing, and frontend integration

- PBI 15: Create favorite list
- PBI 16: Share favorite list via URL
- PBI 17: View shared favorite lists

### Sprint 6 (Week 41): Polish, responsiveness, documentation, and delivery

- PBI 18: Responsive user interface
- PBI 24: Create OpenAPI/Swagger REST API documentation (finalized against the implemented API)
- PBI 27: Implement a free-choice optional feature (only if core scope and MVP are stable)
- UI polish and consistency
- Bug fixing and final validation
- Acceptance criteria verification against the specification

> PBI 25 (backlog/version control) and PBI 26 (project coordination) run continuously across all six sprints rather than in a single sprint; they are project-management disciplines, not one-time deliverables.

## Azure DevOps Project Mapping

- Azure DevOps project: `Elokuvaprojekti` (organization `tlippone24`).
- Iterations `Sprint 1`–`Sprint 6` correspond 1:1 to weeks 36–41 above and are assigned to the "Elokuvaprojekti Team".
- When creating board items from this plan: Epics 1–12 above become Epic work items, PBIs become Product Backlog Item work items (children of their Epic), and the task breakdown under PBI 1 becomes Task work items (children of that PBI). Record the resulting Azure DevOps IDs next to each PBI title in this document once created, per the note at the top of this file.

### Continuous throughout all sprints

- PBI 25: Manage project backlog and version control
- PBI 26: Coordinate project execution and delivery

---

## Priority

The final backlog contains 27 board-ready PBIs across 12 epics, including both product features and the required project delivery work. Epic 1 is a technical enabler for project foundation work, and the last two epics are necessary to cover the formal assignment requirements for testing, documentation, and project management.

## Definition of Ready

A backlog item is ready when:

- It is expressed as a user story.
- It maps clearly to a requirement ID.
- Acceptance criteria are testable and explicit.
- Dependencies are understood by the team.
- It is small enough to complete within a sprint.

## Definition of Done

A backlog item is done when:

- The feature works as required.
- Acceptance criteria are met.
- The functionality is demoable in sprint review.
- Related UI and backend behavior are consistent.
- No critical defects remain for the delivered scope.
