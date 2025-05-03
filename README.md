# PrettyData

## Project info

A data formatting and visualization application created by Zeshan Ayub.

## Features
- Format, validate, minify, and pretty-print JSON, YAML, and XML
- Auto-detect data type
- Copy to clipboard, download as file
- Dark/light/high-contrast mode
- Responsive, accessible, and mobile-friendly UI
- No backend, no tracking, no authentication

## How to deploy on GitHub Pages

To deploy this project on GitHub Pages:

1. Push the code to your GitHub repository
2. Go to your repository settings (https://github.com/[your-username]/PrettyData/settings/pages)
3. Under "Build and deployment" > "Source", select "GitHub Actions"
4. The workflow will automatically build and deploy your site when you push to the main branch

**Important:** You must first enable GitHub Pages in your repository settings before the deployment will work.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd PrettyData

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is configured to deploy to GitHub Pages.

To deploy:
1. Ensure your repository is set up for GitHub Pages in the repository settings
2. Push changes to the main branch
3. GitHub Actions will automatically build and deploy to GitHub Pages

## Project Structure

- `/src` - Application source code
  - `/components` - UI components
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and helpers
  - `/pages` - Application pages
