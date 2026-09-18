# UI Plan

## 1. Core Pages / Screens

The application consists of the following core pages:

- **Home** – Main landing page with search, currently showing movies, movie cards and navigation to other sections.
- **Login** – User login page.
- **Register** – User registration page.
- **Movie Search** – Search and filter movies.
- **Movie Detail** – Detailed information about a movie, including reviews and the option to add it to favorites or a group.
- **Group List** – List of all available groups. Visible for everyone.
- **Group Detail** – Detailed view of a group, visible only to group members.
- **User Profile** – User's profile and account information.
- **Favorite List** – User's personal list of favorite movies. Can be viewed as the user's own page and shared with other users.
- **Shared List** – Publicly accessible version of a user's favorite list through a shared URL.


## 2. Wireframes

The wireframes below describe the basic layout and content of each page.

### Home

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+
|                                                     |
|          Find your next favorite movie              |
|                                                     |
|         [ Search movies and TV shows... ]           |
|                                                     |
+-----------------------------------------------------+
| Now in Cinemas                                      |
|                                                     |
|   [MovieCard] [MovieCard] [MovieCard] [MovieCard]   |
|                                                     |
+-----------------------------------------------------+
| Popular Movies                                      |
|                                                     |
|   [MovieCard] [MovieCard] [MovieCard] [MovieCard]   |
+-----------------------------------------------------+
```

### Login

```text
+----------------------------------+
|             LOGO                 |
|                                  |
|            Log in                |
|                                  |
|   Email                          |
|   [________________________]     |
|                                  |
|   Password                       |
|   [________________________]     |
|                                  |
|          [ Log in ]              |
|                                  |
|     Don't have an account?       |
|           Register               |
+----------------------------------+
```
### Register

```text
+----------------------------------+
|              LOGO                |
|                                  |
|          Create account          |
|                                  |
|   Email                          |
|   [________________________]     |
|                                  |
|   Password                       |
|   [________________________]     |
|                                  |
|   Confirm password               |
|   [________________________]     |
|                                  |
|   Password requirements:         |
|   - Minimum 8 characters         |
|   - One uppercase letter         |
|   - One number                   |
|                                  |
|        [ Register ]              |
|                                  |
|  Already have an account? Login  |
+----------------------------------+
```
### Movie Search

The search page supports at least three search criteria: movie title, genre and release year. An additional criterion such as movie type can also be included.

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

                    Movie Search

        [ Search by title... ] [ Search ]

        Filters:
        [ Genre ▼ ] [ Year ▼ ] [ Type ▼ ]

--------------------------------------------------

        Search results

        [MovieCard] [MovieCard] [MovieCard]

        [MovieCard] [MovieCard] [MovieCard]

        [MovieCard] [MovieCard] [MovieCard]

```
### Movie Detail

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

+------------+----------------------------------------+
|            | Movie Title                            |
|   POSTER   | Release year                           |
|            | Genre                                  |
|            | Rating                                 |
|            |                                        |
|            | [ Add to Favorites ]                   |
|            | [ Add to Group ]                       |
+------------+----------------------------------------+

Description
-------------------------------------------------------
Movie description...

Reviews
-------------------------------------------------------

User123       ★★★★☆       2026-09-16
Great movie!

User456       ★★★★★       2026-09-15
Really enjoyed it.

[ Write a review ]

Rating: ☆ ☆ ☆ ☆ ☆

[ Review text......................... ]

[ Submit review ]

```

### Group List

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

                    Groups

                [ Create Group ]

[ Search groups........................ ]

-------------------------------------------------------

[ Group Name ]       12 members       [ Open ]

[ Group Name ]        8 members       [ Open ]

[ Group Name ]       15 members       [ Open ]

[ Group Name ]        4 members       [ Open ]

```

### Group Detail

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

Group Name
12 members

[ Movies ] [ Members ] [ Settings ]

------------------------------------------------------

Movies

[MovieCard] [MovieCard] [MovieCard]

[ + Add Movie ]

------------------------------------------------------

Members

User123
User456
User789

[ Leave Group ]

```
The detailed group content is hidden if the current user is not a member. Instead they will see:

```text
Group Name

12 members

This group is private.

[ Request to Join ]

```

### User Profile

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

                  User Profile

                [ Photo or icon ]
                Username

Email:
user@example.com

------------------------------------------------------

[ Favorite List ]

[ Groups ]

[ Settings ]

[ Log out ]

------------------------------------------------------

Delete Account

[ Delete Account ]

```

### Favorite List

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

              Username's Favorites

                [ Share List ]

------------------------------------------------------

        [MovieCard] [MovieCard] [MovieCard]

        [MovieCard] [MovieCard] [MovieCard]

------------------------------------------------------

```

### Shared List

```text
+-----------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | Account |
+-----------------------------------------------------+

              Username's Favorites

        This is a shared favorite movie list.

------------------------------------------------------

        [MovieCard] [MovieCard] [MovieCard]

        [MovieCard] [MovieCard] [MovieCard]

------------------------------------------------------

```

## 3. Navigation Flow

### Main Navigation

The main navigation flow is:

```text
Home
├── Movie Search
│   └── Movie Detail
│       ├── Add to Favorites
│       ├── Add to Group
│       └── Write Review
│
├── Group List
│   └── Group Detail
│       ├── View Movies
│       ├── View Members
│       └── Group Settings
│
├── Favorite List
│   └── Shared List
│       └── Movie Detail
│
├── Login
│   └── Home
│
└── Register
    └── Home

```

### Page-to-Page Navigation

- Home → Movie Search
- Home → Group List
- Home → Favorite List
- Home → Login
- Home → Register
- Movie Search → Movie Detail
- Movie Detail → Favorite List
- Movie Detail → Group Detail
- Movie Detail → Write Review
- Group List → Group Detail
- Group Detail → Movie Detail
- User Profile → Favorite List
- User Profile → Group List
- Favorite List → Shared List
- Shared List → Movie Detail
- Login → Home
- Register → Home


# 4. Shared Components

The application uses reusable components to keep the UI consistent and avoid duplicated code.

These components are based on the architecture described in `architecture-plan.md`, section 3.1.


## Navbar

**Component:** `Navbar`

Used on most pages.

Responsibilities:
- Display application logo
- Link to Home
- Link to Movie Search
- Link to Groups
- Link to Favorites when logged in
- Show Login/Register when logged out
- Show User Profile and Logout when logged in


## MovieCard

**Component:** `MovieCard`

Used for displaying movies in:

- Home
- Movie Search
- Group Detail
- Favorite List
- Shared List

Responsibilities:

- Display movie poster
- Display movie title
- Display release year
- Display rating
- Link to Movie Detail


## ReviewList

**Component:** `ReviewList`

Used on the Movie Detail page.

Responsibilities:

- Display movie reviews
- Display username
- Display rating from 1 to 5 stars
- Display review text
- Display review date


## GroupList

**Component:** `GroupList`

Used on the Group List page.

Responsibilities:

- Display available groups
- Display group name
- Display number of members
- Provide navigation to Group Detail


## FavoriteListCard

**Component:** `FavoriteListCard`

Used for displaying movies in a user's favorite list.

Responsibilities:

- Display movie poster
- Display movie title
- Link to Movie Detail
- Allow the owner to remove a movie from favorites


# 5. Responsive Design

The UI should be responsive and work on different screen sizes.

The layout should use responsive grids so that MovieCards and other content automatically adjust to the available screen width.

The navigation should change into a mobile-friendly menu on smaller screens.

Images and text should scale appropriately without breaking the layout.


## Desktop

```text
+----------------------------------------------------------+
| LOGO | Home | Search | Groups | Favorites | User Profile |
+----------------------------------------------------------+

+----------+  +----------+  +----------+  +----------+
| Movie    |  | Movie    |  | Movie    |  | Movie    |
| Card     |  | Card     |  | Card     |  | Card     |
+----------+  +----------+  +----------+  +----------+
```

## Tablet

```text
+-----------------------------------------------+
| LOGO | Home | Search | Groups | User Profile |
+-----------------------------------------------+

+----------+  +----------+  +----------+
| Movie    |  | Movie    |  | Movie    |
| Card     |  | Card     |  | Card     |
+----------+  +----------+  +----------+
```

## Mobile

```text
+----------------------+
|LOGO               ☰ |
+----------------------+

+----------------------+
|      Movie Card      |
+----------------------+

+----------------------+
|      Movie Card      |
+----------------------+

+----------------------+
|      Movie Card      |
+----------------------+
```