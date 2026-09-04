# Scrum Backlog Plan for the Movie Project

This backlog is based on the official solution requirements and is structured for Azure DevOps Scrum use. The format is intentionally board-friendly so each item can be moved into a backlog, sprint, or work item with minimal editing.

## Product Goal

As a user, I want to browse movies, search the catalog, join groups, share favorite lists, and add reviews through a responsive web application built with React, Node.js, and PostgreSQL.

> Note: "Epic N" and "PBI N" labels in this plan are this document's own reference numbers for tracking and cross-referencing, not the actual Azure DevOps work item IDs. Azure DevOps assigns its own sequential ID to every work item you create (regardless of type), so a PBI documented here as "PBI 1" might be created as, e.g., ADO ID 37. When creating a board item from this plan, put the plan's label (e.g. "PBI 1") in the work item title or description for traceability, and note the resulting ADO ID here if useful.

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

### PBI 6: View movies currently in Finnish cinemas

Title: View movies currently in Finnish cinemas

User story:

As a visitor, I want to see movies that are currently showing in Finnish cinemas so that I can discover what is available to watch.

Mapped requirement: ID 6 - Now in cinemas

Acceptance criteria:

- Feature is available without login.
- Movies currently in Finnish cinemas are displayed.
- The list is visible and easy to browse.

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

### PBI 8: Delete a group

Title: Delete a group

User story:

As a group owner, I want to delete my group so that I can remove it when it is no longer needed.

Mapped requirement: ID 7 - Group page

Acceptance criteria:

- Group owner can delete the group they created.
- Group is removed from the list after deletion.
- Group data no longer appears to users.

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

### PBI 11: Remove a group member or leave a group

Title: Remove a group member or leave a group

User story:

As a group owner or member, I want to manage group membership so that I can remove users or leave the group when necessary.

Mapped requirement: ID 9 - Remove member

Acceptance criteria:

- Group owner can remove a member.
- A member can leave the group themselves.
- Membership updates are reflected immediately.

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

### PBI 14: Browse movie reviews

Title: Browse movie reviews

User story:

As a visitor, I want to view movie reviews so that I can evaluate movies before watching them.

Mapped requirement: ID 12 - Review browsing

Acceptance criteria:

- Reviews are visible to all users.
- Reviews are displayed with the relevant movie.
- Review metadata is readable and visible.

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

### PBI 16: Share favorite list via URL

Title: Share favorite list via URL

User story:

As a logged-in user, I want to share my favorite list using a URL so that other users can access it directly.

Mapped requirement: ID 14 - Share favorite list

Acceptance criteria:

- User can generate a shareable URL for the favorite list.
- URL is visible to other users.
- A share button or equivalent action is available in the UI.

### PBI 17: View shared favorite lists

Title: View shared favorite lists

User story:

As a user, I want to view other users' shared favorite lists so that I can discover recommendations.

Mapped requirement: ID 14 - Share favorite list

Acceptance criteria:

- Shared list page is accessible via URL.
- Other users can view the public list content.
- The page shows the list and associated movies.

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

### PBI 21: Test review browsing endpoint

Title: Test review browsing endpoint

User story:

As a developer, I want review browsing tested so that public movie reviews are returned correctly and invalid cases are handled.

Mapped requirement: API testing requirement for review browsing

Acceptance criteria:

- Successful review retrieval is tested.
- Empty or invalid review scenarios are handled.
- Response structure matches expected API behavior.

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

### PBI 23: Create user interface plan

Title: Create user interface plan

User story:

As a project team, we need a UI plan so that the frontend structure and screens are aligned before implementation.

Mapped requirement: user interface design documentation

Acceptance criteria:

- Main screens are listed.
- Navigation structure is described.
- Core UI components are identified.

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

### PBI 25: Manage project backlog and version control

Title: Manage project backlog and version control

User story:

As a project team, we want backlog management and version control practices in place so that work is visible, traceable, and delivered in a controlled way.

Mapped requirement: backlog management and version control

Acceptance criteria:

- backlog is maintained and updated regularly
- version control is used consistently
- commits and branches are managed in a standard way

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

---

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
- UI polish and consistency
- Bug fixing and final validation
- Acceptance criteria verification against the specification

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
