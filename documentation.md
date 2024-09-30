# TaroCMS Documentation

## Overview

TaroCMS is a flexible, scalable, and user-friendly Content Management System (CMS) designed to manage content across multiple websites. It empowers content creators and web administrators to efficiently handle various content types and structures.

## Key Features

1. **Multi-site Management**: Manage multiple websites from a single dashboard.
2. **Custom Post Types**: Create tailored content structures for each site.
3. **Flexible Fields**: Design content with a wide array of field types.
4. **Site Duplication**: Quickly launch new sites by duplicating existing ones.
5. **Headless Architecture**: Provides a powerful API for seamless integration with various front-end technologies.
6. **User-friendly Interface**: An intuitive dashboard built with modern web technologies.

## Technology Stack

- **Backend**: Next.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Frontend**: React with Tailwind CSS and shadcn/ui
- **API**: RESTful API design

## Project Structure

### Directories

- `app/`: Contains the Next.js application pages and components.
  - `(dashboard)/`: Contains dashboard-related pages.
  - `dashboard/`: Contains pages for managing sites and post types.
  - `sites/`: Contains pages for managing individual sites and their post types.
  - `teams/`: Contains pages for managing teams and their sites.
- `lib/`: Contains library code for database interactions and utility functions.
  - `actions/`: Contains server-side actions for managing data.
  - `auth/`: Contains authentication-related code.
  - `db/`: Contains database schema and migration files.
- `components/`: Contains reusable UI components.

### Key Files

- `lib/db/schema.ts`: Defines the database schema using Drizzle ORM.
- `lib/actions/sites.ts`: Contains server-side actions for managing sites.
- `lib/actions/post-types.ts`: Contains server-side actions for managing post types.
- `app/sites/[siteId]/post-types/new/page.tsx`: Page for creating a new post type.

## Database Schema

The database schema is defined using Drizzle ORM and includes the following tables:

- `users`: Stores user information.
- `teams`: Stores team information.
- `team_members`: Links users to teams with specific roles.
- `activity_logs`: Logs user activities.
- `invitations`: Manages team invitations.
- `sites`: Represents different sites managed by teams.
- `post_types`: Defines different types of posts within a site.
- `posts`: Stores individual posts.
- `fields`: Defines custom fields for post types.
- `media`: Manages media files uploaded to the app.

## Server-side Actions

### Sites

- `getSites(teamId: number)`: Retrieves all sites for a given team.
- `getSite(id: number)`: Retrieves a specific site by ID.
- `createSite(data: NewSite)`: Creates a new site.
- `updateSite(id: number, data: Partial<NewSite)`: Updates an existing site.
- `deleteSite(id: number)`: Deletes a site.
- `toggleSiteStatus(id: number)`: Toggles the active status of a site.
- `getSiteWithPostTypes(id: number)`: Retrieves a site with its post types.
- `getSiteWithPostTypesAndFields(id: number)`: Retrieves a site with its post types and fields.
- `duplicateSite(siteId: number)`: Duplicates a site along with its post types and fields.

### Post Types

- `getPostTypes(siteId: number)`: Retrieves all post types for a given site.
- `getPostType(id: number)`: Retrieves a specific post type by ID.
- `createPostType(data: NewPostType)`: Creates a new post type.
- `updatePostType(id: number, data: Partial<NewPostType)`: Updates an existing post type.
- `deletePostType(id: number)`: Deletes a post type.
- `togglePostTypeStatus(id: number)`: Toggles the active status of a post type.
- `getPostTypeBySlug(siteId: number, slug: string)`: Retrieves a post type by its slug.
- `getPostTypeWithFields(id: number)`: Retrieves a post type with its fields.
- `getPostTypesWithFields(siteId: number)`: Retrieves all post types with their fields for a given site.

## Frontend Components

### UI Components

- `Avatar`: Displays user avatars with fallback images.
- `Button`: Customizable button component with various styles and sizes.
- `Card`: Card component with header, content, and footer sections.
- `DropdownMenu`: Dropdown menu with various items and submenus.
- `Form`: Form components including fields, labels, and validation messages.
- `Input`: Custom input field component.
- `Label`: Label component for form fields.
- `RadioGroup`: Radio button group component.

### Pages

- `app/sites/[siteId]/post-types/new/page.tsx`: Page for creating a new post type.
- `app/sites/[siteId]/post-types/page.tsx`: Page for listing post types of a site.
- `app/sites/[siteId]/post-types/[postTypeId]/posts/page.tsx`: Page for listing posts of a post type.
- `app/sites/[siteId]/post-types/[postTypeId]/posts/new.tsx`: Page for creating a new post.

## Environment Variables

The following environment variables are used in the project:

- `POSTGRES_URL`: URL for connecting to the PostgreSQL database.
- `AWS_REGION`: AWS region for S3.
- `AWS_ACCESS_KEY_ID`: AWS access key ID for S3.
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for S3.
- `S3_BUCKET_NAME`: Name of the S3 bucket for storing media files.
- `AUTH_SECRET`: Secret key for signing JWT tokens.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/tarocms.git
   cd tarocms
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Set up environment variables:

   ```sh
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

4. Run database migrations:

   ```sh
   pnpm run migrate
   ```

5. Start the development server:
   ```sh
   pnpm run dev
   ```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
