# My Story (Frontend) — Modern UI with RBAC support.

This project is the frontend application for My Story. It offers a modern, responsive, and accessible user interface built with Next.js, allowing users to interact seamlessly with the secure RBAC backend.

## Table of Contents

- [Key Features](#key-features)
- [Technology Used](#technology-used)
- [Run it Locally](#run-it-locally)
- [Live URL](#live-url)
- [Project Dependencies](#project-dependencies)
- [Connect With Me](#connect-with-me)

## Key Features

- **Responsive Design**
  - Optimized for desktop and mobile devices for smooth navigation.
- **Dynamic UI Rendering**
  - Interface elements adapt dynamically based on user roles and permissions.
- **Modern Components**
  - Built using customizable and accessible components from shadcn/ui.
- **Form Handling**
  - Client-side form management and validation using React Hook Form and Zod.
- **Seamless API Integration**
  - Robust data fetching and state updates communicating with the backend API.

## Technology Used

- **Framework**: Next.js
- **UI Library**: React.js
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui, lucide-react

## Run it Locally

Please follow the below instructions to run this project in your machine:

1. Clone this repository

   ```sh
   git clone https://github.com/sagormajomder/my-story.git
   ```

2. Open the directory "my-story" into visual studio code
3. Navigate to the frontend directory: `cd frontend`
4. Open Terminal and run `pnpm install` (or `npm i`) to install all dependencies
5. Set up environment variables:

   Create a .env.local file in the root directory of `frontend` and add the following environment variables:

   ```
      NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

6. Run `pnpm run dev` to run the project into browser.

   The project will be available on http://localhost:3000/ by default.

## Live URL

#### 🚀 Live Project URL: Not deployed yet.

## Project Dependencies

#### Dependencies List

```json
  "dependencies": {
    "@base-ui/react": "^1.5.0",
    "@hookform/resolvers": "^5.4.0",
    "axios": "^1.17.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.17.0",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.78.0",
    "react-hot-toast": "^2.6.0",
    "shadcn": "^4.10.0",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.4.3"
  }
```

#### Dev Dependencies List

```json
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4"
  }
```

## Connect with Me

✨ Let's connect on different platforms! Feel free to reach out.

🐦 **Twitter:** [@sagormajomder](https://twitter.com/sagormajomder)

🐙 **GitHub:** [@sagormajomder](https://github.com/sagormajomder)

📘 **Facebook:** [@sagormajomder](https://facebook.com/sagormajomder)

🔗 **LinkedIn:** [@sagormajomder](https://www.linkedin.com/in/sagormajomder/)
