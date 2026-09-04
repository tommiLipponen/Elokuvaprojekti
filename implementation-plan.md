# Implementation Plan for the Movie Project

## 1. Goal

This implementation plan is designed around the actual academic schedule and uses one-week sprints. It reduces cross-dependencies and keeps work in small, manageable chunks so the project can be delivered before the project presentation on 15.10.2026.

The project should be built in dependency order so each sprint creates a stable base for the next one.

## 2. Sprint Calendar

Planned sprint rhythm:

- Week 36: Sprint 1
- Week 37: Sprint 2
- Week 38: Sprint 3
- Week 39: Sprint 4
- Week 40: Sprint 5
- Week 41: Sprint 6
- Remaining time: final polish, bug fixing, and presentation preparation

The first sprint starts at week 36, which matches the project timeline requirement.

## 3. Guiding Principles

- Build shared infrastructure before feature work.
- Complete authentication before protected features are implemented.
- Finish the movie domain before group and review features depend on it.
- Keep each sprint small enough to be realistically completed within one week.
- Split work by vertical slices instead of by file type when possible.
- Keep the backend contract stable before frontend integration begins.
- Add basic CI checks early so linting and build issues are caught before they accumulate.
- Use a clear migration workflow to avoid schema drift across the team.
- Treat automated API testing as a required project discipline, not a final add-on.
- Avoid broad refactoring after a sprint has produced a working slice.

## 4. Pre-Implementation Alignment

Before coding begins, the team should agree on a short set of project conventions to reduce future rework:

- JWT payload structure and token lifecycle
- Prisma naming conventions and schema ownership
- API endpoint naming and versioning approach
- standard error response format for backend calls
- OpenAPI generation flow and contract ownership
- branching and pull-request rules for schema and API updates

This is not a redesign step. It is a small coordination step that prevents avoidable churn during implementation.

## 5. Dependency-Based Implementation Order

### Phase 1: Shared Foundation

#### Phase 1 Scope

- initialize the backend and frontend project structure
- define environment variables and sample config
- set up Prisma connection and PostgreSQL local database
- define the core app bootstrap in Express
- add validation and error handling middleware
- create the OpenAPI base definition and generation flow
- set up a basic GitHub Actions workflow for install, lint, and test checks

#### Phase 1 Reason

Everything else depends on a working database connection, shared config, and a stable backend foundation. This phase reduces early blockers and gives all team members a reliable base.

#### Phase 1 Summary

This is the technical scaffolding that supports the rest of the project. Without it, later features would have to guess how the app is configured or how the database is structured.

---

### Phase 2: Authentication and User Identity

#### Phase 2 Scope

- User model and Prisma schema
- registration endpoint
- login endpoint
- logout endpoint
- JWT access token flow
- refresh token flow
- protected route middleware
- account deletion flow
- ownership checks for user-specific actions

#### Phase 2 Reason

Reviews, groups, memberships, favorites, and almost every protected feature rely on authenticated users. This is the most important dependency chain in the project.

#### Phase 2 Summary

The auth layer defines who is allowed to do what. It is a critical base layer because many later features would otherwise be impossible to secure correctly.

---

### Phase 3: Movie Domain Foundation

#### Phase 3 Scope

- TMDB provider module
- environment configuration for API keys
- movie import service
- local movie model and PostgreSQL mapping
- basic search and detail endpoints
- cache layer for frequent live queries
- now-playing or popular movie endpoints

#### Phase 3 Reason

The movie domain is central to the application, and most social features depend on movies being available as stable domain records. This phase creates the data structure that later features use.

#### Phase 3 Summary

This phase connects the application to TMDB, stores useful metadata locally, and ensures the app does not depend on constant live API calls for core user features.

---

### Phase 4: Group and Membership Features

#### Phase 4 Scope

- create group
- view groups
- group detail endpoints
- join request flow
- approve or reject join requests
- remove member or leave group
- visibility rules for members-only content

#### Phase 4 Reason

By this point, the app has user identity and the movie domain, so group logic can be built safely. These features create the first real collaborative product layer.

#### Phase 4 Summary

This phase adds the community layer of the app. It introduces permission logic, group ownership rules, and shared content management.

---

### Phase 5: Review Features

#### Phase 5 Scope

- review model and Prisma schema
- create review endpoint
- list reviews for a movie
- rating validation
- review metadata display
- public review browsing

#### Phase 5 Reason

Reviews depend on users, movies, and auth, but they are still a smaller and highly testable domain once the core structure is ready.

#### Phase 5 Summary

This phase adds user opinions and social proof to the movie experience. It naturally follows the movie and auth layers.

---

### Phase 6: Favorite Lists and Sharing

#### Phase 6 Scope

- favorite list model
- create favorite list
- add and remove movies from a list
- shareable list URL
- display public shared lists
- private versus shared list rules

#### Phase 6 Reason

Favorites rely on stable user identity and movie data. They are not a prerequisite for earlier features, but they are safer to implement once the core domain models are stable.

#### Phase 6 Summary

This phase focuses on personalized user content and social sharing. It is a user-focused feature layer that builds on the stable domain model created earlier.

---

### Phase 7: Frontend Integration and User Experience

#### Phase 7 Scope

- login and registration pages
- protected routes and auth context
- movie discovery pages
- group pages and membership flows
- reviews UI
- favorites and shared list UI
- responsive layout improvements
- error and empty states

#### Phase 7 Reason

The frontend should be connected to a stable API contract. This reduces rework and prevents the UI from dragging the backend design in inconsistent directions.

#### Phase 7 Summary

The frontend is the final integration layer. It should consume the backend after the core contract is already stable and tested.

---

### Phase 8: Final Hardening and Presentation Preparation

#### Phase 8 Scope

- end-to-end validation
- bug fixing and edge-case coverage
- migration verification
- environment validation for Azure
- final GitHub Actions deployment workflow
- acceptance criteria review against the backlog
- project presentation preparation and demo rehearsal

#### Phase 8 Reason

By this stage the functional domains are in place, so the team can focus on reliability, delivery quality, and presentation instead of architecture decisions.

#### Phase 8 Summary

This is the finishing and validation phase. It makes the project ready for delivery and ensures the demo is consistent with the accepted scope.

## 6. MVP Milestone

The team should define a clear MVP checkpoint after the review phase. A realistic MVP includes:

- authentication and protected routes
- movie search and discovery
- group creation and membership flow
- review creation and browsing

At that point the application already demonstrates a meaningful product flow:

- user logs in
- searches a movie
- joins a group
- writes a review

Favorites, sharing, and final UI polish can then be treated as enhancements rather than critical blockers.

## 7. Required Project Documentation and Management Work

The assignment includes mandatory project documentation and management tasks that should be tracked separately from feature development. These are not user-facing product features, but they are required for project completion.

### Documentation and management tasks

- database class diagram
- user interface plan
- REST documentation
- backlog management and sprint tracking
- version control discipline
- project coordination and task ownership across team members

These tasks should be scheduled as parallel project responsibilities throughout the project timeline, not left until the end.

## 8. Automated API Testing Workstream

The assignment requires automated API tests using Jest and Supertest. This should be treated as a required project workstream and should run alongside backend development.

### Required test coverage

- login
- logout
- registration
- account deletion
- review browsing

### Test guidance

- include positive and negative test cases where relevant
- keep tests focused on REST endpoint behavior
- validate both successful requests and validation/error cases
- include tests for authentication failures and invalid input

### Recommended timing

Testing should start as soon as the auth endpoints and review browsing endpoints are ready, and the CI pipeline should run them automatically during later sprints.

## 9. Optional Feature Work

The project contains a free-choice optional feature worth 1 point. This should be treated as stretch scope and should not block the MVP or the final delivery.

Possible examples:

- additional social feature
- extra filtering or recommendation logic
- improved personalization or group extras

The optional feature should be implemented only after the core project scope is stable and the required documentation and testing work is on track.

## 10. Chunked Work Breakdown

### Chunk A: Foundation

- project setup
- database and Prisma initialization
- app bootstrap
- config and environment variables
- OpenAPI structure

#### Chunk A Purpose

Create a reliable technical base for the entire project.

---

### Chunk B: Identity and Security

- auth service
- users service
- JWT and refresh token logic
- protected routes and permissions

#### Chunk B Purpose

Establish the authority model for all protected features.

---

### Chunk C: Movie Data and Discovery

- TMDB integration
- movie import
- DB mapping
- search and discovery endpoints
- caching and data freshness

#### Chunk C Purpose

Create the central content domain that supports the rest of the application.

---

### Chunk D: Community and Access Control

- groups
- memberships
- visibility and approvals
- owner-only actions

#### Chunk D Purpose

Add collaboration and membership logic without inventing unstable cross-dependencies.

---

### Chunk E: Social and Personal Features

- reviews
- favorites
- sharing
- final UI integration

#### Chunk E Purpose

Build the user-facing social layer on top of a stable core.

---

## 11. Suggested Team Split

Team: Iisa, Veera, Topi, and Tommi. The vertical slices below are the suggested division of work; the team should confirm who takes each slice before Sprint 1 starts.

### Slice A: Auth and Users

- registration
- login/logout
- JWT and refresh tokens
- account deletion
- protected route enforcement

### Slice B: Movies and Data Integration

- TMDB provider
- import flow
- PostgreSQL movie data
- search and discovery endpoints
- cache strategy

### Slice C: Groups and Memberships

- group creation
- join requests
- owner approvals
- member management
- permissions and group visibility

### Slice D: Reviews, Favorites, and UI

- reviews
- favorite lists
- public sharing
- frontend pages and responsive styling
- polish and QA

This split keeps each person focused on a vertical slice while still aligning with the project architecture.

## 12. Weekly Sprint Plan

### Sprint 1 (Week 36)

- team alignment meeting before coding starts
- Chunk A: Foundation
- Chunk B: Identity and Security
- basic GitHub Actions workflow for install, lint, and test
- initial backend test setup with Jest + Supertest
- Backlog: PBI 19, PBI 2, PBI 23

### Sprint 2 (Week 37)

- complete auth and user layer
- begin TMDB integration
- initial movie search endpoints
- add auth API tests for login, register, logout, and delete account
- Backlog: PBI 3, PBI 4, PBI 20, PBI 5, PBI 22

### Sprint 3 (Week 38)

- finish movie domain
- finalise local PostgreSQL movie data flow
- start group and membership groundwork
- add review browsing endpoint tests
- Backlog: PBI 6, PBI 7, PBI 8

### Sprint 4 (Week 39)

- complete group and membership features
- begin review implementation
- achieve MVP milestone
- continue testing for auth and review endpoints
- Backlog: PBI 9, PBI 10, PBI 11, PBI 12, PBI 13, PBI 14, PBI 21

### Sprint 5 (Week 40)

- finish reviews
- implement favorites and sharing
- continue frontend integration
- complete remaining API test fixes and validation
- Backlog: PBI 15, PBI 16, PBI 17

### Sprint 6 (Week 41)

- final UI polish and responsiveness
- performance and stability checks
- production deployment workflow
- final demo preparation
- final documentation and project management checklist review
- Backlog: PBI 18, PBI 24 (plus continuous PBI 25, PBI 26)

### Prisma Migration Ownership Rule

All Prisma schema changes must be handled through a controlled process:

- schema changes are reviewed in pull requests
- each migration is generated and committed with the related change
- team members avoid editing the same schema area simultaneously
- migration status is checked before merging features that change the database model

This rule is essential for preventing schema drift and merge conflicts across a four-person team.

## 13. Final Note

This sprint plan is intentionally practical and aligned with the university schedule and assignment requirements. It does not replace the architecture or backlog; instead, it makes the implementation order explicit so the team can avoid unnecessary blockers, keep weekly work moving in clean, testable units, and satisfy the required documentation, project-management, and automated testing tasks.
