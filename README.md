# React Blog Post CRUD Application

A simple web application demonstrating Create, Read, Update, and Delete (CRUD) operations for blog posts using modern React technologies and the JSONPlaceholder API.

## Description

This application allows users to:

* View a list of blog posts fetched from an API.
* Filter the list of posts by title.
* Sort the list by post ID.
* Add new blog posts via a form with input validation.
* Edit existing blog posts.
* Delete blog posts with confirmation.

It showcases best practices like state management with React Query, component-based UI with Shadcn UI, type safety with TypeScript, and responsive design with Tailwind CSS.

**Note:** This project uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) fake API. While it simulates API responses for `POST`, `PUT`, and `DELETE`, it **does not actually persist** these changes on the server. Newly added posts are handled client-side in the React Query cache for demonstration purposes. Edits and deletes simulate the API call but the underlying data on JSONPlaceholder remains unchanged after a refresh.

## Tech Stack

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **State Management (Server):** Tanstack Query (React Query v5)
* **Data Table:** Tanstack Table (React Table v8)
* **HTTP Client:** Axios
* **Form Handling:** React Hook Form
* **Schema Validation:** Zod
* **Notifications:** Sonner (integrated via Shadcn UI)
* **Icons:** Lucide React

## Features

* **View Posts:** Display posts in a sortable and filterable table.
* **Add Post:** Modal form with validation to create new posts.
* **Edit Post:** Modal form pre-filled with post data for updates.
* **Delete Post:** Confirmation dialog before deleting a post.
* **Filtering:** Filter posts by title using an input field.
* **Sorting:** Sort posts by ID by clicking the table header.
* **Input Validation:** Ensures title and body meet length requirements using Zod.
* **Loading States:** Skeleton loaders are displayed while fetching data.
* **Error Handling:** Displays specific error messages for API failures and validation errors.
* **Notifications:** Uses Sonner toasts for feedback on CRUD operations.
* **Responsive Design:** Adapts layout for different screen sizes (mobile, tablet, desktop).
* **Environment Variables:** Uses `.env` file for API configuration.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    * Create a `.env` file in the root of the project.
    * Add the following line to the `.env` file:
        ```.env
        VITE_API_BASE_URL=[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)
        ```
    * *(Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.)*

4.  **Initialize Shadcn UI (if not already set up in the cloned repo):**
    * Run `npx shadcn-ui@latest init` and follow the prompts.
    * Add the necessary components:
        ```bash
        npx shadcn-ui@latest add button dialog form input label textarea table dropdown-menu alert-dialog alert skeleton sonner
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## Environment Variables

* `VITE_API_BASE_URL`: The base URL for the API endpoint (defaults to JSONPlaceholder if not set).



